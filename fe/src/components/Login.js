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

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUserAPI({
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
                <Form onSubmit={handleSubmit}>
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

                  <Button
                    variant="primary"
                    type="submit"
                    style={{ float: "right" }}
                  >
                    Login
                  </Button>
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
