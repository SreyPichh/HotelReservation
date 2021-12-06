Skip to content
Search or jump to…
Pull requests
Issues
Marketplace
Explore
 
@SreyPichh 
A2A-Digital
/
LP-Mobile-app
Private
2
0
0
Code
Issues
Pull requests
Actions
Projects
Security
Insights
LP-Mobile-app/src/containers/Home.js /
@nobnisai
nobnisai fast image loading
Latest commit dac31cd 28 days ago
 History
 2 contributors
@nobnisai@SreyPichh
505 lines (443 sloc)  13.4 KB
   
import React, {Component} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  RefreshControl,
  Platform,
  ActivityIndicator,
  Alert,
  SectionList,
  StatusBar,
  Linking
} from 'react-native';

// config
import config from '../../config';

// network
import NetworkUtils from '../utils/networkUtils';

// Import from other components
import SearchBar from '../components/searchBar';
import NewsArticle from '../components/newsArticle';
import LandPost from '../components/landPost';
import newsArticleData from '../assets/newsArticleData.json';
import landPostData from '../assets/landPostData.json';
import AppSwiper from '../components/appSwiper';
import { deviceTokenNotification, getAllActiveLandmaps, getBlogPost, getNotificaitonLandMapByID, userActiveLocation } from '../constants/APIClient';
import I18n from '../i18n';


// import from third party library
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {openDatabase} from 'react-native-sqlite-storage';
import Geolocation from '@react-native-community/geolocation';
import DeviceInfo from 'react-native-device-info';
import dynamicLinks from '@react-native-firebase/dynamic-links'

// import color
import {PRIMARY} from '../styles/color';

// redux
import { connect } from 'react-redux';
import { userData, searchedWord, searchedData, safeAreaHeight } from '../actions/index';
import { isEmpty } from 'lodash-es';

// open local database
const db = openDatabase({name: 'landMap.db', createFromLocation: 1})

var landmapsArray = new Array()

class Home extends Component {
  // state management
  state = {
    searchQuery: '',
    allActiveLandmaps: [],
    refreshing: false,
    currentPage: 1,
    isPageLoading: false,
    totalPages: null,
    allNewsPost: []
  };

  componentDidMount() {

    I18n.locale = this.props.language_data

    this.checkUserInDB()
    this.getCurrentPlace()
    this.getNewActiveLandmaps()
    this.getNewsPost()
    this.selectDeviceTokenFromDB()

    this.props.navigation.addListener('beforeRemove', (e) => {

      // Prevent default behavior of leaving the screen
      e.preventDefault();
    })
    
    this.props.navigation.addListener('focus', (e) => {
      StatusBar.setBarStyle('dark-content')
      StatusBar.setBackgroundColor('#F0F1F5')
      StatusBar.setTranslucent(false)
    })

    // incoming link
    // if (Platform.OS === 'android') {
    //   Linking.addEventListener('url', this.handleOpenURL);
    //   Linking.getInitialURL().then(url => {
    //     this.navigate(url);
    //   });
    // } else {
    //   Linking.addEventListener('url', this.handleOpenURL);
    //   Linking.getInitialURL().then(url => {
    //     this.navigate(url);
    //   });
    // }

    dynamicLinks().onLink((url) => {
      // handle link inside app
      this.navigate(url)
    });
    dynamicLinks().getInitialLink().then((link) => {
      // handle link in app

      this.navigate(link)
    });

  }

  // custom function
  // handleOpenURL = (event) => {
  //   this.navigate(event.url);
  // }

  navigate = (url) => { 
    
    const deepLink = url.utmParameters.utm_source;

    if (!isEmpty(deepLink)) {
      getNotificaitonLandMapByID(deepLink).then(response => {
        if (response.status == 200) {
          this.props.navigation.navigate('Post Detail', { 
            componentName: 'Home',
            postData: response.data.data
          })
        }
      })
    }
  }

  selectDeviceTokenFromDB = () => {
    db.transaction(tx => {
      tx.executeSql(
        'select * from notification',
        [],
        (tx, results) => {
          if (results.rows.length >= 1) {
            const data = results.rows.item(0)
            deviceTokenNotification(data.device_token, data.isPushNotification, data.device_id, Platform.OS).then(response => {
              console.log('response device*******************: ', response);
            })
          }
        }
      )
    })
  }

  getNewsPost = () => {
    getBlogPost().then(response => {
      if (response.status == 200) {
        this.setState({ allNewsPost: response.data.data })
      } else {
        console.log('error getting blog post');
      }
    })
  }

  getCurrentPlace = () => {
    // get user active location
    Geolocation.getCurrentPosition(info => {
      userActiveLocation(info.coords, DeviceInfo.getUniqueId()).then(response => {
        console.log('response: ', response);
        if (response.status == 201) {
          console.log('successfully updated user active location....');
        } else {
          console.log('Something Went Wrong');
        }
      })
    });
  }

  checkUserInDB() {
    const {userData} = this.props;
    db.transaction(tx => {
      tx.executeSql(
        'select * from user',
        [],
        (tx, results) => {
          if (results.rows.length == 1) {
            userData(results.rows.item(0))
          }
        }
      )
    })
  }

  // for infinite scroll
  getActiveLandmaps = async () => {
    if (this.state.refreshing == true) {
      landmapsArray = new Array()
    }
    await NetworkUtils.isNetworkAvailable() ?
    getAllActiveLandmaps(this.state.currentPage).then(response => {
      this.setState({ refreshing: false, isPageLoading: false, totalPages: response.data.meta.pagination.total_pages })
      if (response.status ==200) {

        response.data.data.map(item => {
          landmapsArray.push(item)
        })

        this.setState({ allActiveLandmaps: landmapsArray })

      } else {
        console.log('error occurs while getting all the active landmaps');
      }
    })
    :
    Alert.alert(
      `You don't have internet connection`,
      'Please check your internet connection.',

      [
        {
          text:'Okay'
        }
      ]
    )
  }

  // for refreshing
  getNewActiveLandmaps = async () => {

    landmapsArray = new Array()

    await NetworkUtils.isNetworkAvailable() ?
    getAllActiveLandmaps(this.state.currentPage).then(response => {

      this.setState({ refreshing: false, totalPages: response.data.meta.pagination.total_pages })
      if (response.status ==200) {

        response.data.data.map(item => {
          landmapsArray.push(item)
        })
        
        this.setState({ allActiveLandmaps: landmapsArray })
        
      } else {
        console.log('error occurs while getting all the active landmaps');
      }

    })
    :
    Alert.alert(
      `You don't have internet connection`,
      'Please check your internet connection.',

      [
        {
          text:'Okay'
        }
      ]
    )
  }

  handleOnRefresh = async () => {

    landmapsArray = new Array()

    await this.setState({ refreshing: true, currentPage: 1, allActiveLandmaps: landmapsArray })
    this.getActiveLandmaps()
    this.getNewsPost()
    
  }

  handleLoadMore = async () => {
    
    await this.setState({ isPageLoading: true })

    if (this.state.currentPage < this.state.totalPages) {
      await this.setState({ currentPage: this.state.currentPage + 1 })
      this.getActiveLandmaps()
    } else {
      this.setState({ isPageLoading: false })
    }

  }

  onSearched = async (data) => {
    const { searchedData } = this.props

    searchedData(data)
  }

  //render function
  render() {

    const { safeAreaHeight } = this.props

    const SectionListData = [
      {
        id: 0
      },
      {
        id: 1
      },
      {
        id: 2,
        title: 'News Article',
        data: this.state.allNewsPost
      },
      {
        id: 3,
        title: 'Land Post',
        data: this.state.allActiveLandmaps
      }
    ]

    return (
      <View style={{ flex: 1, backgroundColor: '#F0F1F5'}}>
        {
          Platform.OS == 'ios' ? <StatusBar barStyle='dark-content'/> : <StatusBar backgroundColor='#F0F1F5' barStyle='dark-content'/>
        }
        <SafeAreaView
          onLayout={(event) => {
            var {height} = event.nativeEvent.layout
            safeAreaHeight(height)
          }}
        >
        </SafeAreaView>
        <FlatList
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          onEndReached={() => this.handleLoadMore()}
          onEndReachedThreshold={ Platform.OS == 'ios' ? 0 : 1 }
          // scrollEventThrottle={1}
          stickyHeaderIndices={[1]}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.handleOnRefresh()}
              tintColor='#3C4043a0'        
              // colors='#1A73E9a0'
            />
          }
          data={SectionListData}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => (
            
            item.id == 0 ?
            <View style={styles.banner}>
              <AppSwiper />
            </View>
            :
            item.id == 1 ?
            <View style={{ backgroundColor: '#F0F1F5' }}>
              <TouchableWithoutFeedback
                onPress={() =>
                  this.props.navigation.navigate('Location Search', {
                    allActiveLandmaps: this.state.allActiveLandmaps,
                    onGoBack: this.onSearched,
                    componentName: 'Home'
                  })
                }
              >
                <View style={styles.search_view}>
                  <Icon name="magnify" style={styles.icon} />
                  <Text style={styles.text}>{I18n.t('SearchLocation')}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            :
            item.id == 2 ?
            <>
              <View style={{flexDirection: 'row', paddingLeft: 10}}>
                <FlatList
                  keyboardShouldPersistTaps="handled"
                  horizontal={true}
                  data={item.data}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  renderItem={({item}) => {
                    return (
                      <>
                        {
                          <TouchableOpacity
                            onPress={() =>
                                this.props.navigation.navigate('News Detail', {
                                  source: item.url,
                                  uri: item.cover_image,
                                  componentName: 'Home',
                                  title: item.title,
                                  subtitle: item.updated_at
                            })}
                          >
                            <NewsArticle
                              key={item.id}
                              image={item.cover_image}
                              title={item.title}
                              subtitle={item.updated_at}
                            />
                          </TouchableOpacity>
                        }
                      </>
                    );
                  }}
                />
              </View>
            </>
            :
            <View style={{flexDirection: 'row', paddingLeft: 10}}>
              <FlatList
                style={{alignSelf: 'center', flex: 1}}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                keyboardShouldPersistTaps="handled"
                data={item.data}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => {
                  return (
                    <>
                      {
                        <LandPost
                          key={item.id}
                          userInfo={item.user_info}
                          image={item.images[0]}
                          title={item.post_title}
                          numberOfViews={item.post_view_number}
                          postData={item}
                          profileImage={item.user_info.profile_image_url}
                          username={item.user_info.username}
                        />
                      }
                    </>
                  );
                }}
              />
            </View>
          )}
        />

        {
          this.state.isPageLoading ?
          <View style={{ paddingTop: 15}}>
            <ActivityIndicator size='small' color='#3C4043a0' />
          </View>
          : 
          null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  foundation: {
    flexDirection: 'column',
    marginBottom: 30,
  },
  banner: {
    width: null,
    resizeMode: 'stretch',
    margin: 10,
  },
  icon: {
    alignSelf: 'center',
    fontSize: 28,
    color: '#616264',
  },
  search_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: '#E7E7E7',
    height: 50,
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
  },
  text: {
    color: '#AAAAAA',
    fontSize: 18,
    paddingLeft: 10,
    flex: 1,
    alignSelf: 'center',
    fontFamily: 'Poppins-Regular'
  },
});

// dispatching action
const mapDispatchToProps = dispatch => {
  return {
    userData: data => dispatch(userData(data)),
    searchedWord: word => dispatch(searchedWord(word)),
    searchedData: word => dispatch(searchedData(word)),
    safeAreaHeight: data => dispatch(safeAreaHeight(data))
  }
}

// extracting data
const mapStateToProps = state => {
  return {
    language_data: state.language_data
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
© 2021 GitHub, Inc.
Terms
Privacy
Security
Status
Docs
Contact GitHub
Pricing
API
Training
Blog
About
Loading complete