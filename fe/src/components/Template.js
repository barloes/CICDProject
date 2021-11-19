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
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles();

export default function Template({ data }) {
  const [isCopied, setIsCopied] = useState(false);

  const codeSnippet = data;

  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 600);
  };

  return (
    <div className="container">
      <div className="code-snippet">
        <div className="code-section">
          <Card text={"dark"} className="mb-2">
            <Card.Header style={{ textAlign: "right" }}>
              <CopyToClipboard text={codeSnippet} onCopy={onCopyText}>
                <span>{isCopied ? "Copied" : <MdContentCopy />}</span>
              </CopyToClipboard>
            </Card.Header>
            <Card.Body>
              <Card.Text>{codeSnippet}</Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
