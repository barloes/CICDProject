import React, { useState } from "react";
import "./App.css";
import Login from "./components/Login";
import useToken from "./components/useToken";
import Homepage from "./components/Homepage";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Deploy from "./components/Deploy";
import Recommendation from "./components/Recommendation";
import NavbarComponent from "./components/NavbarComponent";

function App() {
  const { token, setToken } = useToken();

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <Router>
      <div className="wrapper">
        <NavbarComponent />

        <Switch>
          <Route path="/recommendation">
            <Recommendation />
          </Route>
          <Route path="/deploy">
            <Deploy />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
