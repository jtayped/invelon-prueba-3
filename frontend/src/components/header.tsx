import React from "react";
import { Badge, Col, Row } from "react-bootstrap";

const UserHeader = () => {
  return (
    <Row className="mb-3">
      <Col>
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h3 mb-0">User Panel</h1>
          <Badge bg="primary" className="fs-6">
            12:12:12
          </Badge>
        </div>
      </Col>
    </Row>
  );
};

export default UserHeader;
