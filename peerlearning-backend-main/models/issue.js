const mongoose = require('mongoose')

const issueSchema = new mongoose.Schema({
  peerActivity_id: {
    type: String,
    required: true,
  },
  peerAssignment_id: {
    type: String,
    required: true,
  },
  issues: [
    {
      time: String,
      user_id: String,
      comment: String,
    },
  ],
})

const issue = mongoose.model('issue', issueSchema)
module.exports = issue
