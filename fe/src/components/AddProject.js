import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

async function addProjectAPI(ProjectName, Port) {
  let token = JSON.parse(sessionStorage.getItem("token"));
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
    },
    body: JSON.stringify({ projectName: ProjectName, port: Port }),
  };

  return fetch("/api/project", requestOptions).then((data) => data.json());
}

export default function AddProject({ showHide, setShowHide }) {
  const [ProjectName, setProjectName] = useState();
  const [Port, setPort] = useState();

  function handleModalShowHide() {
    setShowHide(!showHide);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    addProjectAPI(ProjectName, Port);
    handleModalShowHide();
    window.location.reload(false);
  };

  return (
    <Modal show={showHide}>
      <Modal.Header closeButton onClick={() => handleModalShowHide()}>
        <Modal.Title>Add Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter Project Name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Port</Form.Label>
            <Form.Control
              onChange={(e) => setPort(e.target.value)}
              placeholder="Enter Port Number"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSubmit}>
          Add Project
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
