"use client";
import { PREFERENCE_IMAGES } from "@/constants/preferences";
import { env } from "@/env";
import type { User } from "@/types/user";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Badge, Card, Row, Col, Alert } from "react-bootstrap";

const UserGrid = () => {
  const [users, setUsers] = useState<User[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  const renderPreferenceImages = (preferences: string[]) => {
    return preferences.sort().map((pref) => (
      <span key={pref} className="me-2" title={pref}>
        {PREFERENCE_IMAGES[pref] || "🔸"}
      </span>
    ));
  };

  useEffect(() => {
    async function loadUsers() {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const res = await axios.get("http://127.0.0.1:8000/api/users");
        const data = res.data as User[];
        setUsers(data);
      } catch (error) {
        console.error("API request failed:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  if (loading || users === undefined) return <p>loading...</p>;

  return (
    <Row>
      <Col xs={12}>
        <h5 className="mb-3">Users ({users.length})</h5>
        {users.length === 0 ? (
          <Alert variant="info">
            No users found. Add a new user using the form above.
          </Alert>
        ) : (
          <Row className="g-3">
            {users.map((user, index) => (
              <Col key={index} xs={12} sm={6} md={4} lg={3}>
                <Card
                  className={`h-100 ${user.affiliate ? "border-success" : ""}`}
                  style={{
                    backgroundColor: user.affiliate
                      ? "rgba(25, 135, 84, 0.1)"
                      : "#f8f9fa",
                  }}
                >
                  <Card.Body>
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

                    {user.preferences && user.preferences.length > 0 && (
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
};

export default UserGrid;
