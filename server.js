const express = require("express");
const cors = require("cors");

// Import heap functions from heap.js
const { insert, popMin, popMax, getHeap } = require("./heap");

const app = express();
const PORT = 3000;

// Middleware to enable CORS and parse JSON
app.use(cors());
app.use(express.json());

// Insert a new value into the heap
app.post("/insert", (req, res) => {
  const { value } = req.body;
  insert(value); // Insert the value into the heap
  res.json({ success: true, heap: getHeap() }); // Return the updated heap
});

// Pop the minimum value from the heap
app.post("/popMin", (req, res) => {
  const minValue = popMin(); // Pop the min value from the heap
  if (minValue === undefined) {
    return res.status(400).json({ error: "Heap is empty, nothing to pop." });
  }
  res.json({ success: true, popped: minValue, heap: getHeap() }); // Return the updated heap
});

// Pop the maximum value from the heap
app.post("/popMax", (req, res) => {
  const maxValue = popMax(); // Pop the max value from the heap
  if (maxValue === undefined) {
    return res.status(400).json({ error: "Heap is empty, nothing to pop." });
  }
  res.json({ success: true, popped: maxValue, heap: getHeap() }); // Return the updated heap
});  

// Get the current state of the heap
app.get("/heap", (req, res) => {
  res.json({ heap: getHeap() }); // Return the current heap
});

// Root endpoint for checking if the server is running
app.get("/", (req, res) => {
  res.send("Min-Max Heap Backend is running.");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


