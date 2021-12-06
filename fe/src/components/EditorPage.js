import React, { useState } from "react";
import { Editor, EditorState, EditorBlock } from "draft-js";
import { Container, Row, Col, Card, Button, Tabs, Tab } from "react-bootstrap";

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

  return (
    <div>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={6}>
            <br></br>
            <Card>
              <Tabs
                defaultActiveKey="Editor"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                <Tab eventKey="Editor" title="Editor">
                  <Row className="justify-content-md-center">
                    <Col xs={10}>
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
