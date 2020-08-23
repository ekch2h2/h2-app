import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import themeFile from './util/theme';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { logoutUser, getUserData } from "./redux/actions/userActions";

// Components
import Navbar from './components/Navbar';
import AuthRoute from './util/AuthRoute';

// Pages
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';

const theme = createMuiTheme(themeFile);

axios.defaults.baseURL = "https://us-central1-h2-app.cloudfunctions.net/api";

const token = localStorage.FBIdToken;

if (token) {
    const decodedToken = jwtDecode(token);
    if(decodedToken.exp * 1000 < Date.now()) {
        store.dispatch(logoutUser());
        window.location.href = '/login';
    } else {
        axios.defaults.headers.common["Authentication"] = token;
        store.dispatch(getUserData());
    }
}

function App() {
  return (
      <MuiThemeProvider theme={theme}>
          <Provider store={store}>
              <Router>
                  <Navbar/>
                  <div className="container">
                      <Switch>
                          <Route exact path="/" component={home} />
                          <AuthRoute exact path="/login" component={login}/>
                          <AuthRoute exact path="/signup" component={signup}/>
                      </Switch>
                  </div>
              </Router>
          </Provider>
      </MuiThemeProvider>
  );
}

export default App;
