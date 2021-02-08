/* eslint-disable prettier/prettier */
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import mainview from './components/main/mainview';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={mainview} />
      </Switch>
    </Router>
  );
}
