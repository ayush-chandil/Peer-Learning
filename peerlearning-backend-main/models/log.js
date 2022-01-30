const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  event_type: {
    type: String,
    required: true,
  },
  reference_id: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  time_stamp: {
    type: String,
    required: true,
  },
})

const log = mongoose.model('log', logSchema)
module.exports = log
