import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';


class Discover extends Component {
  render(){
    return (
      <View style={styles.container}>
        <Image source={{uri: this.props.image}} style={styles.thumbnailImage} />
        <Text style={styles.title}>{this.props.title}</Text>
        <Text style={{color: 'white', fontSize: 12, fontWeight: '300', marginLeft: 10, marginTop: 5}}>{this.props.tag}</Text>
        <TouchableOpacity 
          style={styles.button} 
        >
          <Text style={{color: 'white'}}>Experience</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: 400,
    marginTop: 30,
    borderRadius: 18,
    marginRight: 16,
    marginBottom: 16
  },
  thumbnailImage:{
    width: '100%',
    height: '100%',
    borderRadius: 18
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
    paddingLeft: 20,
    paddingRight: 100,
    paddingTop: 20,
    position: "absolute" 
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 40,
    backgroundColor: '#254A55',
    borderRadius: 5,
    position: 'absolute',
    left: 20,
    top: 120
  }
});

export default Discover;