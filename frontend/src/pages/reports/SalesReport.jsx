import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function SalesReport() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/sales')
      .then(response => {
        setSales(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const data = sales.map(sale => ({
    name: sale.date,
    total: sale.total,
  }));

  const totalSales = sales.length > 0 ? sales.reduce((acc, sale) => acc + sale.total, 0) : 0;
  const averageSale = sales.length > 0 ? sales.reduce((acc, sale) => acc + sale.total, 0) / sales.length : 0;
  const topSellingProduct = sales.length > 0 ? sales.reduce((max, sale) => max.total > sale.total ? max : sale).product : '';

  return (
    <div className="container">
      <h1 className="mt-4">Sales Report</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div>
          <h5>Sales Summary:</h5>
          <p>Total Sales: ${totalSales}</p>
          <p>Average Sale: ${averageSale}</p>
          <p>Top Selling Product: {topSellingProduct}</p>
          <LineChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Date</th>
                <th scope="col">Product</th>
                <th scope="col">Quantity</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(sale => (
                <tr key={sale.id}>
                  <td>{sale.id}</td>
                  <td>{sale.date}</td>
                  <td>{sale.product}</td>
                  <td>{sale.quantity}</td>
                  <td>${sale.total}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default SalesReport;