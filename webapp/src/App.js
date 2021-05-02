import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
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
import calendar from "./pages/calendar";
// This import loads the firebase namespace along with all its type information.
import firebase from "firebase/app";
import "firebase/auth";
import { setAuthorizationHeader } from "./util/auth";

const theme = createMuiTheme(themeFile);

// // Initialize Firebase
firebase.initializeApp({apiKey: "AIzaSyCCx9TDJtVzEaPym1OyU5KSuWgwslGDzEY"});

firebase.auth().onAuthStateChanged(usr => {
    if (usr) {
        usr.getIdToken().then(token => {
            setAuthorizationHeader(token);
            store.dispatch(getUserData());
        })
    }
});

axios.defaults.baseURL = "https://us-central1-h2-app.cloudfunctions.net/api";
// axios.defaults.baseURL = "http://localhost:5000/h2-app/us-central1/api";

function App() {
  return (
      <MuiThemeProvider theme={theme}>
          <Provider store={store}>
              <Router basename={process.env.PUBLIC_URL}>
                  <Navbar/>
                  <div className="container">
                      <Switch>
                          <Route exact path="/" component={home} />
                          <AuthRoute exact path="/login" component={login}/>
                          <AuthRoute exact path="/signup" component={signup}/>
                          <Route exact path="/users/:handle" component={user}/>
                          <Route exact path="/users/:handle/announcement/:announcementId" component={user}/>
                          <Route exact path="/cal" component={calendar} />
                      </Switch>
                  </div>
              </Router>
          </Provider>
      </MuiThemeProvider>
  );
}

export default App;
