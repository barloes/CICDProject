import React, { useEffect, useState } from "react";
import { Row, Col, ListGroup, CloseButton, Card} from "react-bootstrap";

async function listProjectAPI() {
  let token = JSON.parse(sessionStorage.getItem("token"));
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
    },
  };
  return fetch("/project", requestOptions).then((data) => data.json());
}

async function removeProjectAPI(ProjectName) {
  let token = JSON.parse(sessionStorage.getItem("token"));
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
    },
    body: JSON.stringify({ projectName: ProjectName }),
  };

  return fetch("/project", requestOptions).then((data) => data.json());
}

export default function ListProject() {
  const [data, setData] = useState([]);

  useEffect(() => {
    let mounted = true;
    listProjectAPI().then((items) => {
      setData(items?.results);
    });
    return () => (mounted = false);
  }, []);

  function handleRemove(name) {
    removeProjectAPI(name);
    const newData = data.filter((item) => item.name !== name);

    setData(newData);
  }

  function handleLink(link) {
    if (!link) {
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
    <div>
      {data.map((item, index) => (
        <Row className="justify-content-md-center" key={index}>
          <Col xs={8}>
            <ListGroup as="ol">
              <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start"
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">
                    {index + 1}.{item.name}
                  </div>
                  <Card.Link href={"http://" + item.link}>{item.link}</Card.Link>
                </div>
                {handleLink(item.link)}
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col xs={1}>
            <CloseButton
              style={{ display: "flex", justifyContent: "center" }}
              onClick={() => handleRemove(item.name)}
            />
          </Col>
        </Row>
      ))}
    </div>
  );
}
