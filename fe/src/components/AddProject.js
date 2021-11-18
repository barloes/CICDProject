import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

async function addProjectAPI(ProjectName) {
  let token = JSON.parse(sessionStorage.getItem("token"));
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
    },
    body: JSON.stringify({ projectName: ProjectName }),
  };

  return fetch("/project", requestOptions).then((data) => data.json());
}

export default function AddProject({ showHide, setShowData }) {
  const [ProjectName, setProjectName] = useState();

  function handleModalShowHide() {
    setShowData(!showHide);
  }

  function onSubmit() {
    console.log(ProjectName);
    addProjectAPI(ProjectName);
    handleModalShowHide();
    window.location.reload(false);
  }

  return (
    <Modal show={showHide}>
      <Modal.Header closeButton onClick={() => handleModalShowHide()}>
        <Modal.Title>Add Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              type="test"
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter Project Name"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={(e) => onSubmit()}>
          Add Project
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
