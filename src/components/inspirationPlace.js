import React, {Component} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

class InspirationPlace extends Component {
  render() {
    return(
      <View style={styles.container}>
        <Image source={{uri: this.props.image}} style={styles.thumbnailImage} />
        <Text style={styles.title}>{this.props.title}</Text>
        <Text style={{color: 'white', fontSize: 12, fontWeight: '300', marginLeft: 10, marginTop: 5}}>{this.props.distance}</Text>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: 180,
    marginTop: 30,
    backgroundColor: '#254A55',
    borderRadius: 14,
    marginRight: 16
  },
  thumbnailImage: {
    width: 150,
    height: 120,
    borderTopEndRadius: 14,
    borderTopLeftRadius: 14
  },
  title:{
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10
  }
});

export default InspirationPlace;