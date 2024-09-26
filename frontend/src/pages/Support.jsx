import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function Support() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name) newErrors.name = 'Please enter your name';
    if (!email) newErrors.email = 'Please enter your email';
    if (!subject) newErrors.subject = 'Please enter a subject';
    if (!message) newErrors.message = 'Please enter a message';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Send the support request to the server
      console.log('Support request sent:', { name, email, subject, message });
      setSuccess(true);
    }
  };

  return (
    <Container>
      <Row>
        <Col md={12}>
          <h1 className="mt-4">Support</h1>
          <p>If you have any questions or need help with your order, please fill out the form below and we'll get back to you as soon as possible.</p>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name:</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
              {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email:</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e .target.value)} />
              {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
            </Form.Group>
            <Form.Group controlId="subject">
              <Form.Label>Subject:</Form.Label>
              <Form.Control type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
              {errors.subject && <div style={{ color: 'red' }}>{errors.subject}</div>}
            </Form.Group>
            <Form.Group controlId="message">
              <Form.Label>Message:</Form.Label>
              <Form.Control as="textarea" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
              {errors.message && <div style={{ color: 'red' }}>{errors.message}</div>}
            </Form.Group>
            <Button variant="primary" type="submit">Send Support Request</Button>
            {success && <div style={{ color: 'green' }}>Support request sent successfully!</div>}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Support;