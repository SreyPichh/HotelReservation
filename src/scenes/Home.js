import {isTemplateElement} from '@babel/types';
import React, {Component, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import InspirationPlace from '../components/inspirationPlace';
import Discover from '../components/discover';

// JSON Data
import inspirationPlaceData from '../assets/inspirationPlaceData.json';
import discoverData from '../assets/discoverData.json';

class Home extends Component {
  // const [text, setText] = useState('');
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <Text style={styles.title}>Hello, There!</Text>
          <Text style={{marginTop: 12}}>Let's reserve a room!</Text>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.search}
              placeholder="Search any Hotel!"
              // onChangeText={text => setText(text)}
              // defaultValue={text}
            />
            {/* <Text style={{padding: 10, fontSize: 26}}>{text.split('').map((word) => word && '🍕').join('')}</Text> */}
          </View>

          {/* popular Places */}
          <View style={styles.places}>
            <Text style={{fontWeight: 'bold', fontSize: 18, color: '#254A55'}}>
              Inspiration for your next trip
            </Text>
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              keyboardDismissMode="on-drag"
              data={inspirationPlaceData}
              keyExtractor={item => item.id}
              renderItem={({item}) => {
                return (
                  <>
                    {
                      <TouchableOpacity>
                        <InspirationPlace
                          key={item.id}
                          image={item.image}
                          title={item.title}
                          distance={item.sub}
                        />
                      </TouchableOpacity>
                    }
                  </>
                );
              }}
            />
          </View>

          {/* Discover */}
          <View style={styles.places}>
            <Text style={{fontWeight: 'bold', fontSize: 18, color: '#254A55'}}>
              Discover New Experience
            </Text>
            <FlatList
              data={discoverData}
              keyExtractor={item => item.id}
              renderItem={({item}) => {
                return (
                  <> 
                      <Discover
                        key={item.id}
                        image={item.image}
                        title={item.title}
                        tag={item.tag}
                      />
                  </>
                );
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 26,
    color: '#254A55'
  },
  searchBar: {
    marginTop: 16,
  },
  search: {
    height: 50,
    borderWidth: 1,
    borderColor: '#848484',
    borderRadius: 6,
    paddingLeft: 10,
  },
  places: {
    paddingTop: 30,
  },
});

export default Home;
