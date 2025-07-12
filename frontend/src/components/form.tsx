"use client";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import axios from "axios";

// Zod Schema
const userFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  preferences: z
    .string()
    .transform((val) =>
      val
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p),
    )
    .refine(
      (prefs) => {
        if (prefs.length === 0) return true;

        // Check for duplicates
        const uniquePrefs = [...new Set(prefs)];
        return uniquePrefs.length === prefs.length;
      },
      { message: "Duplicated preferences are not allowed" },
    )
    .refine(
      (prefs) => {
        if (prefs.length === 0) return true;

        // Check for at least one even and one odd preference
        const hasEven = prefs.some((_, index) => index % 2 === 0);
        const hasOdd = prefs.some((_, index) => index % 2 === 1);

        return hasEven && hasOdd;
      },
      { message: "Must include at least one even and one odd preference" },
    ),
  affiliate: z.boolean(),
});

// Types
type UserFormData = z.infer<typeof userFormSchema>;

interface ApiResponse {
  error?: string;
  name?: string;
  email?: string;
  preferences?: string[];
  affiliate?: boolean;
}

const UserForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      preferences: "",
      affiliate: false,
    },
  });

  const onSubmit: SubmitHandler<UserFormData> = async (data: UserFormData) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post("http://127.0.0.1:8000/api/users/", {
        name: data.name,
        email: data.email,
        preferences: data.preferences,
        affiliate: data.affiliate.toString(),
      });

      setSuccess("User created successfully!");
      reset();
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Add New User</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Name *</Form.Label>
                <Form.Control
                  type="text"
                  {...register("name")}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  {...register("email")}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={8}>
              <Form.Group>
                <Form.Label>Preferences</Form.Label>
                <Form.Control
                  type="text"
                  {...register("preferences")}
                  placeholder="water, coffee, soda (comma separated)"
                  isInvalid={!!errors.preferences}
                />
                <Form.Text className="text-muted">
                  Enter preferences separated by commas. Must include at least
                  one even and one odd preference.
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  {errors.preferences?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4} className="d-flex align-items-end">
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label="Affiliate"
                  {...register("affiliate")}
                />
              </Form.Group>
            </Col>
          </Row>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="mt-3">
              {success}
            </Alert>
          )}

          <div className="mt-3">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UserForm;
