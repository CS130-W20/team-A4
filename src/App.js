import React from 'react';
import logo from './logo.svg';
import './App.css';
import CreateRoom from './components/CreateRoom';
import LoginPage from './components/LoginPage';
import { BrowserRouter as Router, Route, useLocation, Switch } from "react-router-dom";
//import SocketContext from './components/SocketContext';
//import * as io from 'socket.io-client';

//const socket = io("ec2-54-184-200-244.us-west-2.compute.amazonaws.com:8080", {"transports": ["polling","websocket"]});

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/createRoom/name=:name&room=:room&roomName=:roomName" component={CreateRoom} />
          <Route path="/" component={LoginPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
