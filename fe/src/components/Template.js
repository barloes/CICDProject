import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdContentCopy } from "react-icons/md";
import { Card } from "react-bootstrap";

function formatNewLine(text) {
  const newText = text?.split("/n").map(function (place, i) {
    return <p key={i}>place</p>;
  });
}

export default function Template({ data }) {
  console.log(data);
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
          <Card.Text>
            <div style={{ whiteSpace: "pre-line" }}>{data}</div>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
