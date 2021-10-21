import {AppRegistry} from 'react-native';
import App from './App';
import React from 'react';

function checkHeadLess({isHeadless}) {
  if (isHeadless) {
    return null;
  } else {
    return <App />;
  }
}

AppRegistry.registerComponent('Ag Market News', () => checkHeadLess);
