import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import Header from './components/Header/Header';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import UserPage from './components/UserPage/UserPage';
import RoomsPage from './components/RoomsPage/RoomsPage';
import SettingsPage from './components/SettingsPage/SettingsPage';

// import './styles/main.css';
import 'antd/dist/antd.css';

const App = () => (
  <div>
    <Header title="Atmos: Home Lighting Recipes" />
    <Router>
      <Switch>
        <Redirect exact from="/" to="/home" />
        <Route
          path="/home"
          component={LoginPage}
        />
        <Route
          path="/register"
          component={RegisterPage}
        />
        <Route
          path="/user"
          component={UserPage}
        />
        <Route
          path="/rooms"
          component={RoomsPage}
        />
        <Route
          path="/settings"
          component={SettingsPage}
        />
        {/* OTHERWISE (no path!) */}
        <Route render={() => <h1>404</h1>} />
      </Switch>
    </Router>
  </div>
);

export default App;