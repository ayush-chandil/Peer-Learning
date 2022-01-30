const mongoose = require('mongoose')

const assignment_scoreSchema = new mongoose.Schema({
    User_id: {
        type: String,
    },
  Assignment_id: {
    type: String,
    // required: true,
  },
  Aconst: {
      type:Number,
  },
  final_grade: {
    type: Number,
  },
})

const AssignmentScore = mongoose.model('assignment_score', assignment_scoreSchema)
module.exports = AssignmentScore
