import React, { useEffect, useState } from "react";
import { Table, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

async function getData() {
  let token = JSON.parse(sessionStorage.getItem("token"));
  console.log(token);
  return fetch("/test", {
    method: "GET",
    headers: { Authorization: `JWT ${token.access_token}` },
  }).then((data) => data.json());
}

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    let mounted = true;
    getData().then((items) => {
      if ("results" in items) {
        setData(items.results);
      }
    });
    return () => (mounted = false);
  }, []);

  console.log(data);

  return (
    <div>
      <Container>
        <Row>
          <Col xs>
            <br></br>
          </Col>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>{item.status}</td>
                  <td>{item.link}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
      </Container>
    </div>
  );
}
