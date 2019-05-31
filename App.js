// Imports: Dependencies
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import firebaseConfig from './config/config';

// Imports: Screens
import Search from './screens/Search';

// Firebase: Initialize
firebase.initializeApp({
  apiKey: `${firebaseConfig.apiKey}`,
  authDomain: `${firebaseConfig.authDomain}`,
  databaseURL: `${firebaseConfig.databaseURL}`,
  projectId: `${firebaseConfig.projectId}`,
  storageBucket: `${firebaseConfig.storageBucket}`,
  messagingSenderId: `${firebaseConfig.messagingSenderId}`,
});

// Firebase: Cloud Firestore
export const database = firebase.firestore();

// React Native App
export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Search />
      </View>
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
