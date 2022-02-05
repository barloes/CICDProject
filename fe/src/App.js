import React, { useState } from "react";
import "./App.css";
import Login from "./components/Login";
import useToken from "./components/useToken";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import EditorPage from "./components/EditorPage";
import Config from "./components/Config";
import NavbarComponent from "./components/NavbarComponent";

function App() {
  const { token, setToken } = useToken();

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <Router>
      <div className="wrapper" style={{ fontFamily: "Arial" }}>
        <NavbarComponent />

      <Switch>
          <Route path="/config">
            <Config />
          </Route>
          <Route path="/editor">
            <EditorPage />
          </Route>
          <Route path="/">
            <Dashboard />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
