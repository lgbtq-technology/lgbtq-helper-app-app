/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View
} from 'react-native';

import App from './app';
import styles from './styles';

class Share extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.instructions}>
        BOOYA
        </Text>
      </View>
    )
  }
}

AppRegistry.registerComponent('LgbtqHelperAppApp', () => App);
AppRegistry.registerComponent('MyShareEx', () => Share);
