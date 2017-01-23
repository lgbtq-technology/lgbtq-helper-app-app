import React, { Component } from 'react';

import {
  AsyncStorage,
  Text,
  View,
  WebView
} from 'react-native';

import P from 'bluebird';
import URL from 'url';

import styles from './styles';
import config from './config';

export default class LgbtqHelperAppApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false
    };

  }

  componentDidMount() {

    const auth = AsyncStorage.getItem('auth').then(JSON.parse)

    const result = auth.then(auth => this.setState({ready: true, auth }))

    result.catch(error => {
      console.warn(error.stack || error)
      this.setState({ready: true, error})
    });
  }

  render() {
    if (!this.state.ready) {
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Loading
          </Text>
        </View>
      )
    }

    if (this.state.error) {
      const error = this.state.error;
      return (
        <View style={styles.container}>
          <Text>
            {String(error.message || error) || 'Error'}
          </Text>
        </View>
      )
    }

    if (!this.state.auth) {
      return (
        <WebView
          source={{uri: `https://slack.com/oauth/authorize?client_id=${config.client_id}&scope=files:read%20files:write:user&redirect_uri=https://metapolis.space/auth`}}
          startInLoadingState={true}
          onNavigationStateChange={e => {
            const url = URL.parse(e.url, true);
            const code = url.query.code
            if (url.pathname == '/auth' && code) {
              login(code).then(auth => {
                return AsyncStorage.setItem('auth', JSON.stringify(auth))
                  .then(() => this.setState({ auth }))
              }).catch(error => {
                console.warn(error, error.stack)
                this.setState({error})
              })
            }
          }}
          onError={error => this.setState({error})}
        />
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Double tap R on your keyboard to reload,{'\n'}
          Shake or press menu button for dev menu
        </Text>
      </View>
    );
  }
}

function ifP (val, y, n) {
  return P.resolve(val)
    .then(val => val ? y && y(val) : n && n(val))
}

function login(code) {
  return fetch(URL.resolve(config.api, '/-/login'), {
    method: 'POST',
    body: JSON.stringify({
      code
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(req => req.json());
}
