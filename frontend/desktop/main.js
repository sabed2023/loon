import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loons, setLoons] = useState([]);

  // Handle form submission to POST data to the server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3030/loons', { name, description });
      alert(response.data.message);
      setName('');
      setDescription('');
      fetchLoons(); // Refresh the list after adding a new loon
    } catch (error) {
      console.error('Error submitting loon:', error);
      alert(error.response?.data.message || 'Error adding Loon. Please try again.');
    }
  };

  // Fetch all Loons from the server
  const fetchLoons = async () => {
    try {
      const response = await axios.get('http://localhost:3030/loons');
      setLoons(response.data);
    } catch (error) {
      console.error('Error fetching loons:', error);
      alert('Error fetching Loons. Please try again.');
    }
  };

  // Fetch loons when the component mounts
  useEffect(() => {
    fetchLoons();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Loon Management</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="name" style={styles.label}>Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="description" style={styles.label}>Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.buttonContainer}>
          <button type="submit" style={styles.button}>Submit</button>
          <button
            type="button"
            onClick={() => {
              setName('');
              setDescription('');
            }}
            style={{ ...styles.button, backgroundColor: '#6c757d' }}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={fetchLoons}
            style={{ ...styles.button, backgroundColor: '#28a745' }}
          >
            GET all Loons
          </button>
        </div>
      </form>

      <div style={styles.loonsContainer}>
        <h3 style={styles.subHeader}>Fetched Loons:</h3>
        {loons.length > 0 ? (
          loons.map((loon) => (
            <div key={loon.id} style={styles.loonItem}>
              <h4 style={styles.loonTitle}>Name: {loon.name}</h4>
              <p>Description: {loon.description}</p>
            </div>
          ))
        ) : (
          <p>No loons found.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: 'auto',
    padding: '20px',
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  inputGroup: {
    marginBottom: '12px',
  },
  label: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
    fontSize: '1rem',
    color: '#495057',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '12px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  loonsContainer: {
    marginTop: '20px',
  },
  subHeader: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '12px',
  },
  loonItem: {
    backgroundColor: '#e9ecef',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '8px',
  },
  loonTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
};

export default App;
