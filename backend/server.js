const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/loonDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Define Counter Schema for Auto-Incrementing ID
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

// Define Loon Schema with Custom Incremental ID
const loonSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
});

const Loon = mongoose.model('Loon', loonSchema);

// Function to Get Next Sequence ID
async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

// CREATE: Add New Entry with Auto-Increment ID
app.post('/loons', async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: 'Name and description are required fields.' });
  }

  try {
    const nextId = await getNextSequence('loonID');
    const loon = new Loon({ id: nextId, name, description });
    await loon.save();
    res.status(201).json({ message: 'Loon added successfully!', loon });
  } catch (error) {
    console.error('Error adding loon:', error);
    res.status(500).json({ message: 'Error adding Loon', error: error.message });
  }
});

// READ: Get All Entries
app.get('/loons', async (req, res) => {
  try {
    const loons = await Loon.find();
    res.status(200).json(loons);
  } catch (error) {
    console.error('Error fetching loons:', error);
    res.status(500).json({ message: 'Error fetching loons', error: error.message });
  }
});

// READ: Get Single Entry by ID
app.get('/loons/:id', async (req, res) => {
  try {
    const loon = await Loon.findOne({ id: parseInt(req.params.id) });
    if (!loon) return res.status(404).json({ message: 'Loon not found' });
    res.status(200).json(loon);
  } catch (error) {
    console.error('Error fetching loon:', error);
    res.status(500).json({ message: 'Error fetching loon', error: error.message });
  }
});

// UPDATE: Update Entry by ID
app.put('/loons/:id', async (req, res) => {
  const { name, description } = req.body;

  try {
    const loon = await Loon.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      { name, description },
      { new: true, runValidators: true }
    );

    if (!loon) return res.status(404).json({ message: 'Loon not found' });
    res.status(200).json({ message: 'Loon updated successfully!', loon });
  } catch (error) {
    console.error('Error updating loon:', error);
    res.status(500).json({ message: 'Error updating loon', error: error.message });
  }
});

// DELETE: Delete Entry by ID
app.delete('/loons/:id', async (req, res) => {
  try {
    const loon = await Loon.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!loon) return res.status(404).json({ message: 'Loon not found' });
    res.status(200).json({ message: 'Loon deleted successfully!' });
  } catch (error) {
    console.error('Error deleting loon:', error);
    res.status(500).json({ message: 'Error deleting loon', error: error.message });
  }
});

// Start the Server
const PORT = 3030;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/loons`);
});
