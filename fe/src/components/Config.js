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
import ConfigModal from "./ConfigModal";
import "bootstrap/dist/css/bootstrap.css";

async function listLanguagesApi() {
  let token = JSON.parse(sessionStorage.getItem("token"));
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
    },
  };
  return fetch("/config", requestOptions).then((data) => data.json());
}

async function getVersionsApi(language) {
  let token = JSON.parse(sessionStorage.getItem("token"));
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
    },
  };
  return fetch("/config/" + language, requestOptions).then((data) =>
    data.json()
  );
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
  return fetch("/config/" + language + "/" + version, requestOptions).then(
    (data) => data.json()
  );
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function Config() {
  const [languages, setLanguages] = useState([{ language: "python" }]);
  const [versions, setVersions] = useState([]);

  const [curLanguage, setCurLanguage] = useState("python");
  const [curVersion, setCurVersion] = useState();

  const [showHide, setShowData] = useState(false);

  useEffect(() => {
    let mounted = true;
    listLanguagesApi().then((items) => {
      setLanguages(items?.results);
    });

    getVersionsApi(languages[0].language).then((items) => {
      setVersions(items?.results);
      setCurVersion(items?.results[0].version);
    });

    return () => (mounted = false);
  }, []);

  const handleChange = async (e) => {
    setCurLanguage(e.target.value);
    getVersionsApi(e.target.value).then((data) => {
      setVersions(data?.results);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(curLanguage);
    console.log(curVersion);

    getConfigApi(curLanguage, curVersion).then((data) => {
      console.log(data);
    });

    //need pass data down to the child component

    setShowData(!showHide);
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
                      <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicSelect">
                          <Form.Label>Select Language</Form.Label>
                          <Form.Control as="select" onChange={handleChange}>
                            {languages.map((item) => {
                              return (
                                <option
                                  value={item.language}
                                  key={item.language}
                                >
                                  {capitalizeFirstLetter(item.language)}
                                </option>
                              );
                            })}
                          </Form.Control>
                          <br></br>
                          <Form.Label>Select Version</Form.Label>
                          <Form.Control
                            as="select"
                            onChange={(e) => setCurVersion(e.target.value)}
                          >
                            {versions.map((item) => {
                              return (
                                <option value={item.version} key={item.version}>
                                  {capitalizeFirstLetter(item.version)}
                                </option>
                              );
                            })}
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
                        <ConfigModal
                          showHide={showHide}
                          setShowData={setShowData}
                        />
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
