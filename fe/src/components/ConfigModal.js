import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Tabs, Tab } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import Template from "./Template";

export default function ConfigModal({ showHide, setShowData }) {
  function handleModalShowHide() {
    setShowData(!showHide);
  }

  return (
    <Modal show={showHide}>
      <Modal.Header closeButton onClick={() => handleModalShowHide()}>
        <Modal.Title>Template</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs transition={false} id="noanim-tab-example" className="mb-3">
          <Tab eventKey="config" title="Config">
            <Template data="aaaaaaaaaaaaaaa" />
          </Tab>
          <Tab eventKey="docker" title="Docker">
            <Template data="bbbbbbbb" />
          </Tab>
          <Tab eventKey="accesskey" title="Access Key">
            <Template data="ccccccccccccc" />
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
