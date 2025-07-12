"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PREFERENCE_IMAGES } from "@/constants/preferences";
import { env } from "@/env";
import { Badge, Card, Row, Col, Alert, Spinner } from "react-bootstrap";
import { userSchema, type UserType } from "@/validators/user";

async function fetchUsers(): Promise<UserType[]> {
  const res = await axios.get(`${env.NEXT_PUBLIC_API_URL}/api/users/`);
  const users = userSchema.array().parse(res.data);
  return users;
}

export default function UserGrid() {
  const {
    data: users,
    isLoading,
    isError,
  } = useQuery<UserType[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return (
      <div className="py-5 text-center">
        <Spinner animation="border" role="status" />
      </div>
    );
  }
  if (isError || !users) {
    return <Alert variant="danger">Failed to load users.</Alert>;
  }

  const renderPreferenceImages = (preferences: string[]) =>
    preferences.sort().map((pref) => (
      <span key={pref} className="me-2" title={pref}>
        {PREFERENCE_IMAGES[pref] ?? "🔸"}
      </span>
    ));

  return (
    <Row className="mt-3">
      <Col xs={12}>
        <h5 className="mb-3">Users ({users.length})</h5>
        {users.length === 0 ? (
          <Alert variant="info">
            No users found. Add a new user using the form above.
          </Alert>
        ) : (
          <Row className="g-3">
            {users.map((user, idx) => (
              <Col key={idx} xs={12} sm={6} md={4} lg={3}>
                <Card
                  className={`h-100 ${user.affiliate ? "border-success" : ""}`}
                  style={{
                    backgroundColor: user.affiliate
                      ? "rgba(25, 135, 84, 0.1)"
                      : "#f8f9fa",
                  }}
                >
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="text-truncate" title={user.name}>
                      {user.name}
                    </Card.Title>

                    <Card.Text>
                      <a
                        href={`mailto:${user.email}`}
                        className="text-decoration-none"
                        title={`Send email to ${user.email}`}
                      >
                        📧 {user.email}
                      </a>
                    </Card.Text>

                    {user.preferences?.length > 0 && (
                      <div className="mb-2">
                        <small className="text-muted d-block">
                          Preferences:
                        </small>
                        <div className="fs-5">
                          {renderPreferenceImages(user.preferences)}
                        </div>
                        <small className="text-muted">
                          {user.preferences.sort().join(", ")}
                        </small>
                      </div>
                    )}

                    <div className="mt-auto">
                      <Badge bg={user.affiliate ? "success" : "secondary"}>
                        {user.affiliate ? "Affiliate" : "Regular"}
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Col>
    </Row>
  );
}
