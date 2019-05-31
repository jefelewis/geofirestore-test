// Imports: Dependencies
import React, { Component } from 'react';
import { Button, Dimensions, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { database } from '../App';
import { GeoFirestore } from 'geofirestore';

// Screen Dimensions
const { height, width } = Dimensions.get('window');

// Screen: Search
class Search extends Component {
  constructor (props) {
    super(props);

    this.state = {
      location: null,
      errorMessage: null,
      isLocationModalVisible: false,
      nearbyLocations: null,
    };
  }

  // Component Will Mount
  componentWillMount() {
    try {
      // Platform: Check Android
      if (Platform.OS === 'android' && !Constants.isDevice) {
        this.setState({
          errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
        });
      }
      // Platform: Check iOS
      else {
        this._getLocationAsync();
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  // Get Location
  _getLocationAsync = async () => {
    try {
      // Status (Location Services Enabled/Disabled)
      let { status } = await Permissions.askAsync(Permissions.LOCATION);

      // Check If Status Is Granted
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied',
        });
      }
  
      // Location
      let location = await Location.getCurrentPositionAsync({});
      this.setState({
        location: location,
      });
    }
    catch (error) {
      console.log(error);
    }
  };

  // Get Nearest Locations
  getNearestLocations = () => {
    try {
      // Current Location: Latitude + Longitude
      let currentLatitude = Number(this.state.location.coords.latitude);
      let currentLongitude = Number(this.state.location.coords.longitude);

      // Create a GeoFirestore reference
      const geofirestore = new GeoFirestore(database);
      
      // Create a GeoCollection reference
      const geocollection = geofirestore.collection('locations')

      // Create a GeoQuery based on a location
      const query = geocollection.near({
        center: new firebase.firestore.GeoPoint(currentLatitude, currentLongitude),
        radius: 2,
      });
      
      // Get query (as Promise)
      query.get().then((value) => {
        console.log(value.docs); // All docs returned by GeoQuery

        this.setState({
          nearbyLocations: value.docs,
        })
      });
    }
    catch (error) {
      console.log(error);
    }
  };

  render() {
    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    }
    else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }

    return (
      <SafeAreaView style={styles.container}>

        <Text>Search Screen</Text>
        <Text style={styles.paragraph}>{text}</Text>

        <Button title="Search" onPress={this.getNearestLocations} />
      </SafeAreaView>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Exports
export default Search;
