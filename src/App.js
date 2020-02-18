import React from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import CreateRoom from './components/CreateRoom';
import LoginPage from './components/LoginPage';
function App() {
  return (
    <div className="App">
      <h1> hello world</h1>
      <Login />
      <CreateRoom />
      <LoginPage />
    </div>
  );
}

export default App;
