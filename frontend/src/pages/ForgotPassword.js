import { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

import API_URL from "../config";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage(null); setError(null);
    try {
      const { data } = await axios.post(`${API_URL}/forgot-password`, { email });
      setMessage(data.message); setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="d-flex justify-content-center">
        <Card className="glass-card" style={{ maxWidth: "440px", width: "100%" }}>
          <Card.Body className="p-4 p-md-5">
            <div className="text-center mb-4 animate-in">
              <div className="icon-circle mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
                </svg>
              </div>
              <h3 className="fw-bold">Forgot Password?</h3>
              <p style={{ color: "var(--text-secondary)" }}>
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            {message && <Alert variant="success" className="text-center">{message}</Alert>}
            {error && <Alert variant="danger" className="text-center">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4 animate-in animate-in-delay-1">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required size="lg" className="py-2" />
              </Form.Group>

              <div className="animate-in animate-in-delay-2">
                <Button type="submit" className="btn-gradient w-100" size="lg" disabled={loading}>
                  {loading ? <><Spinner animation="border" size="sm" className="me-2" />Sending...</> : "Send Reset Link"}
                </Button>
              </div>
            </Form>

            <div className="text-center mt-4 animate-in animate-in-delay-3">
              <Link to="/login" className="fw-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-1" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                </svg>
                Back to Login
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default ForgotPassword;
