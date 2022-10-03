/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {MMKVLoader} from 'react-native-mmkv-storage';

// populate storage adapter to global object
globalThis.secureStorage = new MMKVLoader()
  .withEncryption()
  .withInstanceID('secure_creds')
  .initialize()

AppRegistry.registerComponent(appName, () => App);
