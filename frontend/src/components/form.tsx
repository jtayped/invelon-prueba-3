"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import axios, { type AxiosError, type AxiosResponse } from "axios";
import { env } from "@/env";
import { useState } from "react";

// Zod schema & types
const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  preferences: z
    .string()
    .transform((val) =>
      val
        .split(",")
        .map((p) => Number(p))
        .filter((n) => !Number.isNaN(n)),
    )
    .refine((prefs) => new Set(prefs).size === prefs.length, {
      message: "Duplicated preferences are not allowed",
    })
    .refine(
      (prefs) =>
        prefs.length === 0 ||
        (prefs.some((n) => n % 2 === 0) && prefs.some((n) => n % 2 !== 0)),
      { message: "Must include at least one even and one odd preference" },
    ),
  affiliate: z.boolean(),
});

type UserFormRaw = z.input<typeof userFormSchema>;
type UserFormData = z.infer<typeof userFormSchema>;

export default function UserForm() {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormRaw, unknown, UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      preferences: "",
      affiliate: false,
    },
  });

  type CreateUserResponse = AxiosResponse<unknown, unknown>;
  type CreateUserError = AxiosError<{ error: string }>;

  const createUser = useMutation<
    CreateUserResponse,
    CreateUserError,
    UserFormData
  >({
    mutationFn: (newUser) =>
      axios.post(`${env.NEXT_PUBLIC_API_URL}/api/users/`, newUser),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      reset();
      setServerSuccess("User created successfully!");
      setServerError(null);
    },
    onError: (error) => {
      const msg = error.response?.data?.error ?? "An unexpected error occurred";
      setServerError(msg);
      setServerSuccess(null);
    },
  });

  const onSubmit: SubmitHandler<UserFormData> = (data) => {
    setServerError(null);
    setServerSuccess(null);
    createUser.mutate(data);
  };

  return (
    <Card className="mb-4 shadow-sm">
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
                  placeholder="e.g. 1,2,3 (comma separated)"
                  isInvalid={!!errors.preferences}
                />
                <Form.Text className="text-muted">
                  Enter comma-separated numbers. Must include at least one even
                  and one odd.
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

          {serverError && (
            <Alert variant="danger" className="mt-3">
              {serverError}
            </Alert>
          )}
          {serverSuccess && (
            <Alert variant="success" className="mt-3">
              {serverSuccess}
            </Alert>
          )}

          <div className="mt-3 text-end">
            <Button
              type="submit"
              variant="primary"
              disabled={createUser.isPending}
            >
              {createUser.isPending ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Submitting…
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
}
