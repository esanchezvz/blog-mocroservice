import './src/styles/index.css';

import React from 'react';
import { render } from 'react-dom';

import App from './src/App';

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
