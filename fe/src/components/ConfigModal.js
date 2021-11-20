import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Tabs, Tab } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import Template from "./Template";
import Test from "./Test";

export default function ConfigModal({ showHide, setShowHide, configData }) {
  function handleModalShowHide() {
    setShowHide(!showHide);
  }

  return (
    <Modal show={showHide}>
      <Modal.Header closeButton onClick={() => handleModalShowHide()}>
        <Modal.Title>Template</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs transition={false} id="noanim-tab-example" className="mb-3">
          <Tab eventKey="config" title="Config">
            <Template data={configData?.config} />
          </Tab>
          <Tab eventKey="docker" title="Docker">
            <Template data={configData?.docker} />
          </Tab>
          <Tab eventKey="accesskey" title="Access Key">
            <Test />
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => handleModalShowHide()}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
}