import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert, Spinner, InputGroup } from "react-bootstrap";
import axios from "axios";

const API_URL = "http://localhost:5001/api/auth";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/reset-password/${token}`)
      .then(({ data }) => { setTokenValid(true); setEmail(data.email); })
      .catch((err) => { setTokenValid(false); setError(err.response?.data?.message || "Invalid or expired link."); })
      .finally(() => setVerifying(false));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setMessage(null); setError(null);
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      setMessage(data.message); setPassword(""); setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <Container>
        <div className="d-flex justify-content-center">
          <Card className="glass-card text-center" style={{ maxWidth: "440px", width: "100%" }}>
            <Card.Body className="p-5">
              <Spinner animation="border" style={{ color: "var(--accent)", width: "48px", height: "48px" }} />
              <p className="mt-3" style={{ color: "var(--text-secondary)" }}>Verifying your reset link...</p>
            </Card.Body>
          </Card>
        </div>
      </Container>
    );
  }

  if (!tokenValid) {
    return (
      <Container>
        <div className="d-flex justify-content-center">
          <Card className="glass-card text-center" style={{ maxWidth: "440px", width: "100%" }}>
            <Card.Body className="p-4 p-md-5">
              <div className="icon-circle mx-auto mb-3" style={{ background: "#ff6b6b", boxShadow: "0 8px 24px rgba(255,107,107,0.3)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                </svg>
              </div>
              <h3 className="fw-bold mb-2">Link Expired</h3>
              <p style={{ color: "var(--text-secondary)" }} className="mb-4">{error}</p>
              <Button onClick={() => navigate("/forgot-password")} className="btn-gradient px-4">
                Request New Link
              </Button>
            </Card.Body>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-center">
        <Card className="glass-card" style={{ maxWidth: "440px", width: "100%" }}>
          <Card.Body className="p-4 p-md-5">
            <div className="text-center mb-4 animate-in">
              <div className="icon-circle mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                  <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1V3a4 4 0 0 1 7.874-.89A2 2 0 0 0 11 1m-4 7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                </svg>
              </div>
              <h3 className="fw-bold">Reset Password</h3>
              <p style={{ color: "var(--text-secondary)" }}>New password for <strong style={{ color: "var(--accent)" }}>{email}</strong></p>
            </div>

            {message && (
              <Alert variant="success" className="text-center">
                {message}
                <div className="mt-2">
                  <Button variant="outline-success" size="sm" onClick={() => navigate("/login")}>Go to Login</Button>
                </div>
              </Alert>
            )}
            {error && <Alert variant="danger" className="text-center">{error}</Alert>}

            {!message && (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 animate-in animate-in-delay-1">
                  <Form.Label>New Password</Form.Label>
                  <InputGroup>
                    <Form.Control type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} size="lg" className="py-2" />
                    <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/><path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709z"/><path d="m10.707 12.707-5.414-5.414L1.293 3.293a.5.5 0 0 1 .707-.707l14 14a.5.5 0 0 1-.707.707z"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg>
                      )}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4 animate-in animate-in-delay-2">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type="password" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} size="lg" className="py-2" />
                </Form.Group>

                <div className="animate-in animate-in-delay-3">
                  <Button type="submit" className="btn-gradient w-100" size="lg" disabled={loading}>
                    {loading ? <><Spinner animation="border" size="sm" className="me-2" />Resetting...</> : "Reset Password"}
                  </Button>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default ResetPassword;
