import React from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import CreateRoom from './components/CreateRoom';
import LoginPage from './components/LoginPage';
import { BrowserRouter as Router, Route, useLocation, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/createRoom/name=:name&room=:room" component={CreateRoom} />
          <Route path="/" component={LoginPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
