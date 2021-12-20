import React, { useState } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Tabs,
  Tab,
  Form,
} from "react-bootstrap";
import PropTypes from "prop-types";

import "./Login.css";

async function loginUserAPI(credentials) {
  return fetch("/api/login", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

async function registerUserAPI(credentials) {
  return fetch("/api/register", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleLogin = async (e) => {
    e.preventDefault();
    const token = await loginUserAPI({
      username,
      password,
    });
    if ("access_token" in token) setToken(token);
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    const token = await registerUserAPI({
      username,
      password,
    });
    if ("access_token" in token) setToken(token);
  };

  return (
    <div>
      <br></br>
      <Row className="justify-content-md-center">
        <Col xs={5}>
          <Card>
            <Card.Header as="h5" style={{ textAlign: "center" }}>
              Login
            </Card.Header>
            <Row className="justify-content-md-center">
              <Col xs={8}>
                <br></br>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      placeholder="Enter Username"
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                  <Row>
                    <Col md={{ span: 6, offset: 7 }}>
                      <Button
                        variant="secondary"
                        type="submit"
                        onClick={handleRegister}
                      >
                        Register
                      </Button>{" "}
                      <Button
                        variant="primary"
                        type="submit"
                        onClick={handleLogin}
                      >
                        Login
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
            <br></br>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
