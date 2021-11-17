import React, { useEffect, useState } from "react";
import { Row, Col, ListGroup, CloseButton } from "react-bootstrap";

async function getData() {
  let token = JSON.parse(sessionStorage.getItem("token"));
  return fetch("/test", {
    method: "GET",
    headers: { Authorization: `Bearer ${token.access_token}` },
  }).then((data) => data.json());
}

async function removeItem() {
  let token = JSON.parse(sessionStorage.getItem("token"));
  return fetch("/test", {
    method: "GET",
    headers: { Authorization: `Bearer ${token.access_token}` },
    body: { test: "test" },
  }).then((data) => data.json());
}

export default function ListProject() {
  const [data, setData] = useState([]);

  useEffect(() => {
    let mounted = true;
    getData().then((items) => {
      setData(items?.results);
    });
    return () => (mounted = false);
  }, []);

  function handleRemove(name) {
    const newData = data.filter((item) => item.name !== name);

    setData(newData);
  }

  function handleStatus(status) {
    if (status != "Complete") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-emoji-expressionless"
          viewBox="0 0 16 16"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
          <path d="M4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm5 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
        </svg>
      );
    } else {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-emoji-smile"
          viewBox="0 0 16 16"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
          <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
        </svg>
      );
    }
  }
  return (
    <Row className="justify-content-md-center">
      <Col xs={8}>
        {data.map((item) => (
          <ListGroup as="ol" numbered key={item.name}>
            <ListGroup.Item
              as="li"
              className="d-flex justify-content-between align-items-start"
            >
              <div className="ms-2 me-auto">
                <div className="fw-bold">
                  {item.name} {handleStatus(item.status)}
                </div>
              </div>

              <CloseButton onClick={() => handleRemove(item.name)} />
            </ListGroup.Item>
          </ListGroup>
        ))}
      </Col>
    </Row>
  );
}
