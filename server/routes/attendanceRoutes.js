const express = require('express');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { records, date } = req.body;

    if (!date || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: 'Date and attendance records are required' });
    }

    const operations = records.map((record) => ({
      updateOne: {
        filter: { studentId: record.studentId, date },
        update: { $setOnInsert: { studentId: record.studentId, date, status: record.status } },
        upsert: true
      }
    }));

    const result = await Attendance.bulkWrite(operations, { ordered: false });
    return res.status(201).json({
      message: 'Attendance submitted',
      insertedCount: result.upsertedCount || 0,
      note: 'Duplicate entries for the same student and date are ignored'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate attendance record detected' });
    }
    return res.status(500).json({ message: 'Server error while marking attendance' });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const { date } = req.query;

    const filter = {};
    if (date) filter.date = date;

    const records = await Attendance.find(filter)
      .populate('studentId', 'name rollNumber class')
      .sort({ date: -1, createdAt: -1 });

    const total = records.length;
    const presentCount = records.filter((r) => r.status === 'present').length;
    const percentage = total > 0 ? ((presentCount / total) * 100).toFixed(2) : '0.00';

    return res.json({
      total,
      presentCount,
      absentCount: total - presentCount,
      attendancePercentage: Number(percentage),
      records
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while fetching attendance report' });
  }
});

router.get('/students-with-status', protect, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const students = await Student.find().sort({ rollNumber: 1 });
    const records = await Attendance.find({ date });

    const map = new Map(records.map((item) => [item.studentId.toString(), item.status]));

    const merged = students.map((student) => ({
      _id: student._id,
      name: student.name,
      rollNumber: student.rollNumber,
      class: student.class,
      status: map.get(student._id.toString()) || 'not_marked'
    }));

    return res.json(merged);
  } catch (error) {
    return res.status(500).json({ message: 'Server error while loading students with status' });
  }
});

module.exports = router;
