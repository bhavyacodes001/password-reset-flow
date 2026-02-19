import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Nav, Tab, Form, Button, Alert, Spinner, InputGroup, Badge } from "react-bootstrap";
import axios from "axios";

import API_URL from "../config";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileErr, setProfileErr] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNew, setConfirmNew] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState(null);
  const [passErr, setPassErr] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "null");
    if (!stored) { navigate("/login"); return; }
    setUser(stored);
    setName(stored.name || "");
  }, [navigate]);

  const handleLogout = () => { localStorage.removeItem("user"); navigate("/login"); };

  const handleProfileUpdate = async (e) => {
    e.preventDefault(); setProfileLoading(true); setProfileMsg(null); setProfileErr(null);
    try {
      const { data } = await axios.put(`${API_URL}/profile`, { userId: user.id, name });
      setUser(data.user); localStorage.setItem("user", JSON.stringify(data.user));
      setProfileMsg("Profile updated successfully!");
    } catch (err) { setProfileErr(err.response?.data?.message || "Failed to update"); }
    finally { setProfileLoading(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault(); setPassMsg(null); setPassErr(null);
    if (newPassword !== confirmNew) { setPassErr("Passwords do not match"); return; }
    if (newPassword.length < 6) { setPassErr("Min. 6 characters required"); return; }
    setPassLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/change-password`, { userId: user.id, currentPassword, newPassword });
      setPassMsg(data.message); setCurrentPassword(""); setNewPassword(""); setConfirmNew("");
    } catch (err) { setPassErr(err.response?.data?.message || "Failed to change password"); }
    finally { setPassLoading(false); }
  };

  if (!user) return null;

  const techStack = [
    { name: "React", desc: "JavaScript library for building dynamic user interfaces with components.", color: "#61DAFB", icon: "⚛️" },
    { name: "Node.js", desc: "Server-side JavaScript runtime built on Chrome's V8 engine.", color: "#339933", icon: "🟢" },
    { name: "Express.js", desc: "Minimal Node.js framework for building fast RESTful APIs.", color: "#888", icon: "🚀" },
    { name: "MongoDB", desc: "NoSQL document database for flexible, scalable data storage.", color: "#47A248", icon: "🍃" },
    { name: "Bootstrap", desc: "Responsive CSS framework for mobile-first web design.", color: "#7952B3", icon: "🎨" },
    { name: "Nodemailer", desc: "Node.js module for sending emails via SMTP transports.", color: "#0F9DCE", icon: "📧" },
    { name: "bcrypt.js", desc: "Library for securely hashing passwords before storage.", color: "#FF6B6B", icon: "🔐" },
    { name: "Mongoose", desc: "Elegant MongoDB object modeling with schema validation.", color: "#880000", icon: "📦" },
  ];

  const features = [
    { title: "Secure Authentication", desc: "Passwords hashed with bcrypt (12 salt rounds). Plain-text never stored.", icon: "🔒" },
    { title: "Email Verification", desc: "Crypto-random tokens sent via Gmail SMTP with HTML email templates.", icon: "📧" },
    { title: "Token Expiry", desc: "Reset links expire after 15 minutes. Expired tokens auto-rejected.", icon: "⏱️" },
    { title: "Responsive Design", desc: "Fully responsive with Bootstrap 5. Works on all screen sizes.", icon: "📱" },
    { title: "RESTful API", desc: "Clean REST architecture with proper HTTP codes and error handling.", icon: "🌐" },
    { title: "One-Time Tokens", desc: "Tokens cleared after use, preventing replay attacks.", icon: "🛡️" },
  ];

  const EyeBtn = ({ show, onToggle }) => (
    <Button variant="outline-secondary" onClick={onToggle}>
      {show ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/><path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709z"/><path d="m10.707 12.707-5.414-5.414L1.293 3.293a.5.5 0 0 1 .707-.707l14 14a.5.5 0 0 1-.707.707z"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg>
      )}
    </Button>
  );

  return (
    <Container fluid className="px-3 px-md-4" style={{ maxWidth: "1100px" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center py-3 mb-3 animate-in">
        <div>
          <h4 className="fw-bold mb-0" style={{ color: "var(--text-primary)" }}>
            {user.name ? `Hello, ${user.name}` : "Welcome!"}
          </h4>
          <small style={{ color: "var(--text-muted)" }}>{user.email}</small>
        </div>
        <Button variant="light" onClick={handleLogout} className="fw-semibold px-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
          </svg>
          Logout
        </Button>
      </div>

      <Tab.Container defaultActiveKey="about">
        <Card className="glass-card" style={{ animationDelay: "0.1s" }}>
          <Card.Header className="pt-3 px-4" style={{ borderRadius: "20px 20px 0 0" }}>
            <Nav variant="pills" className="gap-2 flex-wrap">
              <Nav.Item><Nav.Link eventKey="about" className="fw-medium px-3">About Project</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="tech" className="fw-medium px-3">Tech Stack</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="profile" className="fw-medium px-3">Profile</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="security" className="fw-medium px-3">Security</Nav.Link></Nav.Item>
            </Nav>
          </Card.Header>

          <Card.Body className="p-4">
            <Tab.Content>
              {/* ===== ABOUT ===== */}
              <Tab.Pane eventKey="about">
                <div className="text-center mb-4">
                  <div className="icon-circle mx-auto mb-3" style={{ width: "76px", height: "76px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="white" viewBox="0 0 16 16">
                      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
                    </svg>
                  </div>
                  <h3 className="fw-bold">Password Reset Flow</h3>
                  <p style={{ color: "var(--text-secondary)", maxWidth: "550px" }} className="mx-auto">
                    A complete authentication system with secure password reset via email verification,
                    demonstrating industry-standard security practices.
                  </p>
                </div>
                <Row className="g-3 mt-2">
                  {features.map((f, i) => (
                    <Col md={6} key={i}>
                      <Card className="feature-card h-100">
                        <Card.Body className="p-3">
                          <div className="d-flex align-items-start gap-3">
                            <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>{f.icon}</span>
                            <div>
                              <h6 className="fw-bold mb-1" style={{ color: "var(--text-primary)" }}>{f.title}</h6>
                              <p className="mb-0" style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{f.desc}</p>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>

                <Card className="section-card mt-4 text-center" style={{ border: "1px solid rgba(108, 92, 231, 0.3)", background: "linear-gradient(135deg, rgba(108, 92, 231, 0.1) 0%, rgba(0, 206, 201, 0.1) 100%)" }}>
                  <Card.Body className="p-4 py-5">
                    <div className="icon-circle mx-auto mb-3" style={{ animation: "glow 3s ease-in-out infinite" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                        <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1H7.163a.5.5 0 0 1-.45-.285A3 3 0 0 0 4 5z"/>
                        <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                      </svg>
                    </div>
                    <h4 className="fw-bold mb-2" style={{ color: "var(--text-primary)" }}>Try the Password Reset Flow</h4>
                    <p style={{ color: "var(--text-secondary)", maxWidth: "450px" }} className="mx-auto mb-4">
                      Experience the complete email-based password reset — from requesting a link to setting a new password.
                    </p>
                    <Button className="btn-gradient px-5 py-2" style={{ fontSize: "1.05rem" }} onClick={() => { localStorage.removeItem("user"); navigate("/forgot-password"); }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
                      </svg>
                      Reset Password Now
                    </Button>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* ===== TECH STACK ===== */}
              <Tab.Pane eventKey="tech">
                <h4 className="fw-bold mb-1">Technologies Used</h4>
                <p style={{ color: "var(--text-secondary)" }} className="mb-4">The complete stack powering this application</p>
                <Row className="g-3">
                  {techStack.map((t, i) => (
                    <Col xs={6} md={4} lg={3} key={i}>
                      <Card className="tech-card h-100 text-center">
                        <Card.Body className="p-3">
                          <span className="tech-icon d-inline-block" style={{ fontSize: "2rem" }}>{t.icon}</span>
                          <h6 className="fw-bold mt-2 mb-1" style={{ color: "var(--text-primary)" }}>{t.name}</h6>
                          <Badge pill className="mb-2" style={{ background: t.color, fontSize: "0.6rem" }}>{t.name}</Badge>
                          <p className="mb-0" style={{ color: "var(--text-secondary)", fontSize: "0.78rem" }}>{t.desc}</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <Card className="section-card mt-4">
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-3" style={{ color: "var(--text-primary)" }}>Architecture</h5>
                    <Row>
                      <Col md={6}>
                        <h6 className="fw-semibold mb-2" style={{ color: "var(--accent)" }}>Frontend</h6>
                        <ul className="list-unstyled" style={{ color: "var(--text-secondary)" }}>
                          <li className="mb-1">React with React Router</li>
                          <li className="mb-1">React Bootstrap UI components</li>
                          <li className="mb-1">Axios for HTTP requests</li>
                          <li className="mb-1">Google Fonts (Inter)</li>
                        </ul>
                      </Col>
                      <Col md={6}>
                        <h6 className="fw-semibold mb-2" style={{ color: "var(--accent)" }}>Backend</h6>
                        <ul className="list-unstyled" style={{ color: "var(--text-secondary)" }}>
                          <li className="mb-1">Node.js with Express.js</li>
                          <li className="mb-1">MongoDB Atlas + Mongoose</li>
                          <li className="mb-1">Nodemailer (Gmail SMTP)</li>
                          <li className="mb-1">bcrypt.js password hashing</li>
                        </ul>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* ===== PROFILE ===== */}
              <Tab.Pane eventKey="profile">
                <h4 className="fw-bold mb-1">Profile Settings</h4>
                <p style={{ color: "var(--text-secondary)" }} className="mb-4">Manage your account information</p>
                <Card className="section-card mb-4">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <div className="d-flex align-items-center justify-content-center rounded-circle fw-bold" style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)", fontSize: "1.4rem", color: "white", flexShrink: 0 }}>
                        {(user.name || user.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <h5 className="fw-bold mb-0" style={{ color: "var(--text-primary)" }}>{user.name || "No name set"}</h5>
                        <span style={{ color: "var(--text-muted)" }}>{user.email}</span>
                      </div>
                    </div>
                    {profileMsg && <Alert variant="success" className="py-2">{profileMsg}</Alert>}
                    {profileErr && <Alert variant="danger" className="py-2">{profileErr}</Alert>}
                    <Form onSubmit={handleProfileUpdate}>
                      <Form.Group className="mb-3">
                        <Form.Label>Display Name</Form.Label>
                        <Form.Control type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} size="lg" className="py-2" />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" value={user.email} disabled size="lg" className="py-2" />
                        <Form.Text>Email cannot be changed</Form.Text>
                      </Form.Group>
                      <Button type="submit" className="btn-gradient" disabled={profileLoading}>
                        {profileLoading ? <><Spinner animation="border" size="sm" className="me-2" />Saving...</> : "Save Changes"}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
                <Card className="section-card">
                  <Card.Body className="p-4">
                    <h6 className="fw-bold mb-1" style={{ color: "var(--text-primary)" }}>Account Details</h6>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }} className="mb-3">Your account metadata</p>
                    <div className="d-flex flex-wrap gap-4">
                      <div><small style={{ color: "var(--text-muted)" }} className="d-block">User ID</small><code>{user.id}</code></div>
                      <div><small style={{ color: "var(--text-muted)" }} className="d-block">Status</small><Badge style={{ background: "var(--accent)" }}>Active</Badge></div>
                    </div>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* ===== SECURITY ===== */}
              <Tab.Pane eventKey="security">
                <h4 className="fw-bold mb-1">Security Settings</h4>
                <p style={{ color: "var(--text-secondary)" }} className="mb-4">Manage your password and account security</p>

                <Card className="section-card mb-4" style={{ border: "1px solid rgba(108, 92, 231, 0.3)", background: "linear-gradient(135deg, rgba(108, 92, 231, 0.08) 0%, rgba(0, 206, 201, 0.08) 100%)" }}>
                  <Card.Body className="p-4">
                    <Row className="align-items-center">
                      <Col xs={12} md={8}>
                        <div className="d-flex align-items-center gap-3">
                          <div className="icon-circle" style={{ width: "52px", height: "52px", flexShrink: 0, animation: "glow 3s ease-in-out infinite" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" viewBox="0 0 16 16">
                              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
                            </svg>
                          </div>
                          <div>
                            <h5 className="fw-bold mb-1" style={{ color: "var(--text-primary)" }}>Forgot Your Password?</h5>
                            <p className="mb-0" style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                              Reset your password via email verification — the core feature of this project.
                            </p>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} md={4} className="text-md-end mt-3 mt-md-0">
                        <Button className="btn-gradient px-4" onClick={() => { localStorage.removeItem("user"); navigate("/forgot-password"); }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                            <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1H7.163a.5.5 0 0 1-.45-.285A3 3 0 0 0 4 5z"/>
                            <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                          </svg>
                          Reset via Email
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Card className="section-card">
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-3" style={{ color: "var(--text-primary)" }}>Change Password</h5>
                    {passMsg && <Alert variant="success" className="py-2">{passMsg}</Alert>}
                    {passErr && <Alert variant="danger" className="py-2">{passErr}</Alert>}
                    <Form onSubmit={handleChangePassword}>
                      <Form.Group className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <InputGroup>
                          <Form.Control type={showCurrent ? "text" : "password"} placeholder="Enter current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required size="lg" className="py-2" />
                          <EyeBtn show={showCurrent} onToggle={() => setShowCurrent(!showCurrent)} />
                        </InputGroup>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <InputGroup>
                          <Form.Control type={showNew ? "text" : "password"} placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} size="lg" className="py-2" />
                          <EyeBtn show={showNew} onToggle={() => setShowNew(!showNew)} />
                        </InputGroup>
                        <Form.Text>Must be at least 6 characters</Form.Text>
                      </Form.Group>
                      <Form.Group className="mb-4">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control type="password" placeholder="Re-enter new password" value={confirmNew} onChange={(e) => setConfirmNew(e.target.value)} required minLength={6} size="lg" className="py-2" />
                      </Form.Group>
                      <Button type="submit" variant="outline-danger" className="fw-semibold px-4" disabled={passLoading}>
                        {passLoading ? <><Spinner animation="border" size="sm" className="me-2" />Changing...</> : "Change Password"}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>

      <div className="text-center py-4 animate-in" style={{ animationDelay: "0.5s" }}>
        <small style={{ color: "var(--text-muted)" }}>
          Password Reset Flow &mdash; React &bull; Node.js &bull; MongoDB &bull; Bootstrap
        </small>
      </div>
    </Container>
  );
}

export default Home;
