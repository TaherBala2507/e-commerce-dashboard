import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

function Setting() {
  const [siteName, setSiteName] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [siteEmail, setSiteEmail] = useState("");
  const [sitePhone, setSitePhone] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get('/api/settings')
      .then(response => {
        setSiteName(response.data?.siteName);
        setSiteDescription(response.data?.siteDescription);
        setSiteEmail(response.data?.siteEmail);
        setSitePhone(response.data?.sitePhone);
        setSiteAddress(response.data?.siteAddress);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      siteName,
      siteDescription,
      siteEmail,
      sitePhone,
      siteAddress,
    };
    axios
      .post("/api/settings", formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        setErrors(error.response.data.errors);
      });
  };

  return (
    <Container>
      <Row>
        <Col md={12}>
          <h1 className="mt-4">Settings</h1>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="siteName">
                <Form.Label>Site Name:</Form.Label>
                <Form.Control
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                />
                {errors.siteName && (
                  <div style={{ color: "red" }}>{errors.siteName}</div>
                )}
              </Form.Group>
              <Form.Group controlId="siteDescription">
                <Form.Label>Site Description:</Form.Label>
                <Form.Control
                  type="text"
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                />
                {errors.siteDescription && (
                  <div style={{ color: "red" }}>{errors.siteDescription}</div>
                )}
              </Form.Group>
              <Form.Group controlId="siteEmail">
                <Form.Label>Site Email:</Form.Label>
                <Form.Control
                  type="email"
                  value={siteEmail}
                  onChange={(e) => setSiteEmail(e.target.value)}
                />
                {errors.siteEmail && (
                  <div style={{ color: "red" }}>{errors.siteEmail}</div>
                )}
              </Form.Group>
              <Form.Group controlId="sitePhone">
                <Form.Label>Site Phone:</Form.Label>
                <Form.Control
                  type="text"
                  value={sitePhone}
                  onChange={(e) => setSitePhone(e.target.value)}
                />
                {errors.sitePhone && (
                  <div style={{ color: "red" }}>{errors.sitePhone}</div>
                )}
              </Form.Group>
              <Form.Group controlId="siteAddress">
                <Form.Label>Site Address:</Form.Label>
                <Form.Control
                  type="text"
                  value={siteAddress}
                  onChange={(e) => setSiteAddress(e.target.value)}
                />
                {errors.siteAddress && (
                  <div style={{ color: "red" }}>{errors.siteAddress}</div>
                )}
              </Form.Group>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Setting;
