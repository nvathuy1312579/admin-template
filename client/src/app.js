import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import store from './store/configureStore';

import themes from './themes';
import Routers from './routers';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={themes.default}>
        <CssBaseline />
        <Routers />
      </ThemeProvider>
    </Provider>
  );
}

export default process.env.NODE_ENV === 'development' ? hot(App) : App;
