import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import themeFile from './util/theme';
import axios from 'axios';

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { getUserData } from "./redux/actions/userActions";

// Components
import Navbar from './components/layout/Navbar';
import AuthRoute from './util/AuthRoute';

// Pages
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';
import user from './pages/user';

const theme = createMuiTheme(themeFile);

axios.defaults.baseURL = "https://us-central1-h2-app.cloudfunctions.net/api";
// axios.defaults.baseURL = "http://localhost:5000/h2-app/us-central1/api";

const token = localStorage.FBIdToken;

if (token) {
    axios.defaults.headers.common["Authentication"] = token;
    store.dispatch(getUserData());
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
                          <Route exact path="/users/:handle" component={user}/>
                          <Route exact path="/users/:handle/announcement/:announcementId" component={user}/>
                      </Switch>
                  </div>
              </Router>
          </Provider>
      </MuiThemeProvider>
  );
}

export default App;
