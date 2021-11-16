import React from "react";
import Dashboard from "./Dashboard";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Button } from "@material-ui/core";
import NavbarComponent from "./NavbarComponent";

export default function Homepage() {
  return (
    <div>
      <NavbarComponent />
      <Button variant="contained">Hello World</Button>
    </div>
  );
}
