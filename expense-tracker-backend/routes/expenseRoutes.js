const express = require('express');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Get all expenses for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving expenses', error: error.message });
  }
});

// ✅ Get a single expense by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (!expense.user.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to view this expense" });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expense", error: error.message });
  }
});

// ✅ Create a new expense
router.post('/', protect, async (req, res) => {
  const { title, amount, date } = req.body;
  try {
    const newExpense = new Expense({
      user: req.user._id,
      title,
      amount,
      date
    });
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(400).json({ message: 'Error adding expense', error: error.message });
  }
});

// ✅ Update an existing expense
router.put('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (!expense.user.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to update this expense" });
    }

    expense.title = req.body.title || expense.title;
    expense.amount = req.body.amount || expense.amount;
    expense.date = req.body.date || expense.date;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: "Error updating expense", error: error.message });
  }
});

// ✅ Delete an expense
router.delete('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (!expense.user.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to delete this expense" });
    }

    await expense.deleteOne();
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting expense", error: error.message });
  }
});
module.exports = router;
