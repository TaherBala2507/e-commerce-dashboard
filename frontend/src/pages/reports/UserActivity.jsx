import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form } from 'react-bootstrap';

function UserActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('id');

  useEffect(() => {
    axios.get('/api/user-activities')
      .then(response => {
        setActivities(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const filteredActivities = activities.filter(activity => {
    return activity.user.toLowerCase().includes(filter.toLowerCase()) ||
           activity.activity.toLowerCase().includes(filter.toLowerCase()) ||
           activity.date.toLowerCase().includes(filter.toLowerCase());
  });

  const sortedActivities = filteredActivities.sort((a, b) => {
    if (sort === 'id') {
      return a.id - b.id;
    } else if (sort === 'user') {
      return a.user.localeCompare(b.user);
    } else if (sort === 'activity') {
      return a.activity.localeCompare(b.activity);
    } else if (sort === 'date') {
      return new Date(a.date) - new Date(b.date);
    }
  });

  return (
    <div className="container">
      <h1 className="mt-4">User Activity</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div>
          <Form>
            <Form.Group controlId="filter">
              <Form.Label>Filter:</Form.Label>
              <Form.Control type="text" value={filter} onChange={e => setFilter(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="sort">
              <Form.Label>Sort:</Form.Label>
              <Form.Control as="select" value={sort} onChange={e => setSort(e.target.value)}>
                <option value="id">ID</option>
                <option value="user">User</option>
                <option value="activity">Activity</option>
                <option value="date">Date</option>
              </Form.Control>
            </Form.Group>
          </Form>
          <Table striped bordered hover>
 <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">User</th>
                <th scope="col">Activity</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedActivities.map(activity => (
                <tr key={activity.id}>
                  <td>{activity.id}</td>
                  <td>{activity.user}</td>
                  <td>{activity.activity}</td>
                  <td>{activity.date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default UserActivity;