import React from "react";
import { Col, Container, Row, NavDropdown, Nav } from "react-bootstrap";
import { FaGlobe, FaUser } from "react-icons/fa"; // Import icons

function TopBar() {
  return (
    <>
      <Container fluid className="bg-dark">
        <Row className="align-items-center py-2">
          {/* Left Section: Web Icon */}
          <Col lg={3} className="d-flex align-items-center">
            <a
              href="https://your-live-website.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGlobe size={24} className="me-2 text-white" />
            </a>
          </Col>

          {/* Right Section: User Icon, Username, and Dropdown */}
          <Col
            lg={{ span: 3, offset: 6 }}
            className="d-flex justify-content-end"
          >
            <Nav>
              <NavDropdown
                title={
                  <span className="text-white">
                    <FaUser size={20} className="me-2 text-white" />
                    John Doe {/* Replace with dynamic username */}
                  </span>
                }
                id="user-dropdown"
                align="end"
                className="text-white"
              >
                <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
                <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default TopBar;
