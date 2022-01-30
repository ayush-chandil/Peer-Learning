const mongoose = require('mongoose')

const AssignmentSchema = new mongoose.Schema({
  assignment_id: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: String,
    required: true,
  },
  course_id: {
    type: String,
    required: true,
  },
  course_name: {
    type: String,
    required: true,
  },
  assignment_title: {
    type: String,
    required: true,
  },
  total_questions: {
    type: Number,
    required: true,
  },
  max_marks_per_question: {
    type : Array,
    required: true,
  },
  reviewer_deadline: {
    type: String,
  },
  status: {
    type: String,
  },
})

const Assignment = mongoose.model('Assignment', AssignmentSchema)
module.exports = Assignment
