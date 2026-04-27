const express = require('express');
const Student = require('../models/Student');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { name, rollNumber, class: className } = req.body;

    if (!name || !rollNumber || !className) {
      return res.status(400).json({ message: 'Name, roll number and class are required' });
    }

    const existing = await Student.findOne({ rollNumber });
    if (existing) {
      return res.status(400).json({ message: 'Student with this roll number already exists' });
    }

    const student = await Student.create({ name, rollNumber, class: className });
    return res.status(201).json({ message: 'Student added successfully', student });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while adding student' });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const students = await Student.find().sort({ rollNumber: 1 });
    return res.json(students);
  } catch (error) {
    return res.status(500).json({ message: 'Server error while fetching students' });
  }
});

module.exports = router;
