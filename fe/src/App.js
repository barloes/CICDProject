import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Preferences from "./components/Preferences";
import useToken from "./components/useToken";
import { Navbar } from "react-bootstrap";

function App() {
  const { token, setToken } = useToken();

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Switch>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/preferences">
            <Preferences />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
