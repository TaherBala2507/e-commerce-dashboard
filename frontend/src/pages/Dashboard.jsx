// Dashboard.js
import React, { useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the required scales and elements
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  // Sample data for the line chart (sales over time)
  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Sales',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  // Sample data for the bar chart (sales by category)
  const barData = {
    labels: ['Electronics', 'Clothing', 'Home', 'Books', 'Beauty'],
    datasets: [
      {
        label: 'Sales',
        data: [3000, 2000, 1500, 1200, 1800],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  return (
    <div className="p-3">
      <h1>Dashboard</h1>
      <Row className="mt-3">
        <Col lg={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Total Sales</Card.Title>
              <Card.Text>$12,345</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Total Orders</Card.Title>
              <Card.Text>150</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Total Customers</Card.Title>
              <Card.Text>200</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col lg={6}>
          <Card>
            <Card.Body>
              <Card.Title>Sales Over Time</Card.Title>
              <Line data={lineData} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <Card.Body>
              <Card.Title>Sales by Category</Card.Title>
              <Bar data={barData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Recent Orders</Card.Title>
              <Card.Text>
                {/* You can render a list of recent orders here */}
                Order #12345, Order #12346, Order #12347
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
