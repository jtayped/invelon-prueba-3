import React from "react";
import { Col, Row } from "react-bootstrap";

const UserHeader = () => {
  return (
    <Row className="mb-3">
      <Col>
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h3 mb-0">User Panel</h1>
        </div>
      </Col>
    </Row>
  );
};

export default UserHeader;
