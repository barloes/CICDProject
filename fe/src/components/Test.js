import React, { useEffect, useState, useRef } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdContentCopy } from "react-icons/md";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Tabs,
  Tab,
  Tooltip,
  OverlayTrigger,
  Table,
} from "react-bootstrap";

async function getAccessKey() {
  let token = JSON.parse(sessionStorage.getItem("token"));
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
    },
    body: JSON.stringify(),
  };

  return fetch("/api/accesskey", requestOptions).then((data) => data.json());
}

export default function Test() {
  const [change, setChange] = useState(false);
  const [accessId, setAccessId] = useState("");
  const [accessSecret, setAccessSecret] = useState("");

  useEffect(() => {
    let mounted = true;
    getAccessKey().then((items) => {
      setAccessId(items?.results.accessId);
      setAccessSecret(items?.results.accessSecret);
    });

    return () => (mounted = false);
  }, []);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {change ? `Copied!` : `Click To Copy`}
    </Tooltip>
  );

  const handleChange = () => {
    setChange(true);

    setTimeout(() => {
      setChange(false);
    }, 600);
  };

  function rowToCopy(name) {
    return (
      <div style={{ fontSize: "13px", fontWeight: "450" }}>
        {name.length < 23 ? `${name}` : `${name.substring(0, 20)}...`}{" "}
        <OverlayTrigger
          key={name}
          placement="top"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip}
        >
          <CopyToClipboard text={name}>
            <MdContentCopy style={{ float: "right" }} onClick={handleChange} />
          </CopyToClipboard>
        </OverlayTrigger>
      </div>
    );
  }

  return (
    <div>
      <Row lg="auto" className="justify-content-md-center">
        <Table className="no-spacing" responsive="sm" hover bordered>
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{rowToCopy("AWS_ACCESS_KEY_ID")}</td>
              <td>{rowToCopy(accessId)}</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td>{rowToCopy("AWS_SECRET_ACCESS_KEY")}</td>
              <td>{rowToCopy(accessSecret)}</td>
            </tr>
          </tbody>
        </Table>
      </Row>
    </div>
  );
}
