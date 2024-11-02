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
      const response = await axios.post('http://localhost:3030/loons', {
        name,
        description,
      });
      alert(response.data.message);
      setName('');
      setDescription('');
      fetchLoons(); // Refresh the list after adding a new loon
    } catch (error) {
      console.error('Error submitting loon:', error);
      alert(
        error.response?.data.message || 'Error adding Loon. Please try again.'
      );
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
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Loon Management</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Submit
          </button>
          <button
            type="button"
            onClick={() => {
              setName('');
              setDescription('');
            }}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Reset
          </button>
          <button type="button" onClick={fetchLoons} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            GET all Loons
          </button>
        </div>
      </form>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Fetched Loons:</h3>
        {loons.length > 0 ? (
          loons.map((loon) => (
            <div key={loon.id} className="bg-gray-100 p-4 rounded mb-4 shadow">
              <h4 className="font-bold">Name: {loon.name}</h4>
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

export default App;
