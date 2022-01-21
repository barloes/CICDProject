import React, { useState } from "react";
import { Editor, EditorState, EditorBlock, convertToRaw } from "draft-js";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Tabs,
  Tab,
  Alert,
} from "react-bootstrap";

const yamlLint = require("yaml-lint");
import "./EditorPage.css";

class Line extends React.Component {
  render() {
    const { block, contentState } = this.props;
    const lineNumber =
      contentState
        .getBlockMap()
        .toList()
        .findIndex((item) => item.key === block.key) + 1;
    return (
      <div className="line" data-line-number={lineNumber}>
        <div className="line-text">
          <EditorBlock {...this.props} />
        </div>
      </div>
    );
  }
}

const blockRendererFn = () => ({
  component: Line,
});

export default function EditorPage() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
  const mappedBlocks = blocks.map(
    (block) => (!block.text.trim() && "\n") || block.text
  );

  let newText = "";
  for (let i = 0; i < mappedBlocks.length; i++) {
    const block = mappedBlocks[i];

    // handle last block
    if (i === mappedBlocks.length - 1) {
      newText += block;
    } else {
      // otherwise we join with \n, except if the block is already a \n
      if (block === "\n") newText += block;
      else newText += block + "\n";
    }
  }

  yamlLint
    .lint(newText.replace("\n\x00",""))
    .then(() => {
      setIsError(false);
    })
    .catch((error) => {
      setIsError(true);
      console.error("Invalid YAML file.", error);
      setErrorMessage(error.message);
    });

  return (
    <div>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={6}>
            <br></br>
            <Card>
              <Tabs
                defaultActiveKey="Yaml"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                <Tab eventKey="Yaml" title="Yaml">
                  <Row className="justify-content-md-center">
                    <Col xs={10}>
                      {isError ? (
                        <Alert variant="danger">{errorMessage}</Alert>
                      ) : null}

                      <div className="container-root">
                        <Editor
                          editorState={editorState}
                          onChange={setEditorState}
                          blockRendererFn={blockRendererFn}
                        />
                      </div>
                    </Col>
                  </Row>
                </Tab>
              </Tabs>

              <br></br>
            </Card>
          </Col>
        </Row>
      </Container>{" "}
    </div>
  );
}
