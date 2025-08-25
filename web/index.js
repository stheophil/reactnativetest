/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import {createRoot} from 'react-dom/client';

AppRegistry.registerComponent(appName, () => App);

const root = createRoot(document.getElementById('root'));
root.render(<App />);
