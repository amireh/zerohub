import './polyfills';
import React from 'react';
import { render } from 'react-dom';
import Root from './screens/Root';

render(<Root />, document.body.querySelector('#app'));