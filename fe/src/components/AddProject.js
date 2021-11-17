import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

export default function AddProject({ showHide, setShowData }) {
  function handleModalShowHide() {
    setShowData(!showHide);
  }
  return (
    <Modal show={showHide}>
      <Modal.Header closeButton onClick={() => handleModalShowHide()}>
        <Modal.Title>Add Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleModalShowHide()}>
          Close
        </Button>
        <Button variant="primary" onClick={() => handleModalShowHide()}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
