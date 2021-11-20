import React, { useEffect, useState } from "react";
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
  Form,
} from "react-bootstrap";

function formatNewLine(text) {
  const newText = text?.split("\n").map((str) => <div>{str}</div>);

  return newText;
}

export default function Template({ data }) {
  const [isCopied, setIsCopied] = useState(false);

  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 600);
  };

  return (
    <div>
      <Card text={"dark"} className="mb-2">
        <Card.Header style={{ textAlign: "right" }}>
          <CopyToClipboard text={data} onCopy={onCopyText}>
            <div>{isCopied ? "Copied!" : <MdContentCopy />}</div>
          </CopyToClipboard>
        </Card.Header>
        <Card.Body style={{ fontSize: "13px", fontWeight: "450" }}>
          <Card.Text>{formatNewLine(data)}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
