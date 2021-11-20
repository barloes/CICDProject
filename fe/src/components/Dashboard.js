import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Tabs, Tab } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import AddProject from "./AddProject";
import ListProject from "./ListProject";

export default function Dashboard() {
  const [showHide, setShowHide] = useState(false);

  return (
    <div>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={6}>
            <br></br>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowHide(!showHide)}
              >
                Add Project
              </Button>{" "}
            </div>
            <AddProject showHide={showHide} setShowHide={setShowHide} />
            <br></br>
            <Card>
              <Tabs
                defaultActiveKey="Project"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                <Tab eventKey="Project" title="Project">
                  <br></br>

                  <ListProject />
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
