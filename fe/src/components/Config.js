import React, { useEffect, useState } from "react";
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
import "bootstrap/dist/css/bootstrap.css";

async function listLanguageApi() {
  let token = JSON.parse(sessionStorage.getItem("token"));
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
    },
  };
  return fetch("/language", requestOptions).then((data) => data.json());
}

async function getConfigApi(language, version) {
  let token = JSON.parse(sessionStorage.getItem("token"));
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
    },
  };
  return fetch(
    "/language/" + language.toLowerCase() + "/" + version,
    requestOptions
  ).then((data) => data.json());
}

export default function Config() {
  const [language, setLanguage] = useState();
  const [version, setVersion] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={6}>
            <br></br>
            <Card>
              <Tabs
                defaultActiveKey="Config"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                <Tab eventKey="Config" title="Config">
                  <br></br>

                  <Row className="justify-content-md-center">
                    <Col xs={8}>
                      <Form>
                        <Form.Group controlId="formBasicSelect">
                          <Form.Label>Select Language</Form.Label>
                          <Form.Control
                            as="select"
                            value={language}
                            onChange={(e) => {
                              setLanguage(e.target.value);
                            }}
                          >
                            <option value="DICTUM">Dictamen</option>
                            <option value="CONSTANCY">Constancia</option>
                            <option value="COMPLEMENT">Complemento</option>
                          </Form.Control>
                          <br></br>
                          <Form.Label>Select Version</Form.Label>
                          <Form.Control
                            as="select"
                            value={version}
                            onChange={(e) => {
                              setVersion(e.target.value);
                            }}
                          >
                            <option value="DICTUM">Dictamen</option>
                            <option value="CONSTANCY">Constancia</option>
                            <option value="COMPLEMENT">Complemento</option>
                          </Form.Control>
                        </Form.Group>
                        <br></br>
                        <Button
                          variant="primary"
                          type="submit"
                          style={{ float: "right" }}
                        >
                          Generate
                        </Button>
                      </Form>
                    </Col>
                  </Row>
                </Tab>
              </Tabs>

              <br></br>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
