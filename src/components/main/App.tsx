import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import mainview from './components/main/mainview';

// const Hello = () => {
//   return (
//     <div>
//       <h1>Hello React</h1>
//     </div>
//   );
// };

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={mainview} />
      </Switch>
    </Router>
  );
}
