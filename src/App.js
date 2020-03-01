import React from 'react';
import logo from './logo.svg';
import './App.css';
import Room from './components/Room';
import LoginPage from './components/LoginPage';
import { BrowserRouter as Router, Route, useLocation, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/room/name=:name&roomID=:room&roomName=:roomName" component={Room} />
          <Route path="/" component={LoginPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
