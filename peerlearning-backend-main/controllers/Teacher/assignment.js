const axios = require('axios')
const Assignment = require('../../models/assignment')
const Log = require('../../models/log')
const config = require('../../config')

exports.addPeerReview = async (req, res) => {
  let assignment = new Assignment()
  assignment.assignment_id = req.body.assignment_id
  assignment.course_id = req.body.course_id
  assignment.owner = req.body.owner
  assignment.max_marks_per_question = req.body.max_marks_per_question
  var marksArray = req.body.max_marks_per_question
  assignment.status = 'Added'
  assignment.total_questions = marksArray.length

  await axios
    .get(`${config.app.GC_API}/courses/${req.body.course_id}`, {
      headers: {
        Authorization: `Bearer ${req.body.access_token}`,
      },
    })
    .then(async (data) => {
      assignment.course_name = await data.data.name
      //console.log(data)
      console.log('xxx ' + assignment.course_name)
    })
    .catch((err) => {
      console.log(err)
    })

  await axios
    .get(
      `${config.app.GC_API}/courses/${req.body.course_id}/courseWork/${req.body.assignment_id}`,
      {
        headers: {
          Authorization: `Bearer ${req.body.access_token}`,
        },
      }
    )
    .then(async (data) => {
      assignment.assignment_title = await data.data.title
      console.log('t1 ' + assignment.assignment_title)
      console.log(data.data.title)
    })
    .catch((err) => {
      console.log('err2')
    })

  await assignment.save().then(
    (as) => {
      let log = new Log()
      log.user_id = req.body.owner
      log.event_type = 'ADDED_PEER_ASSIGNMENT'
      log.reference_id = assignment._id
      log.description = assignment.assignment_title
      log.time_stamp = new Date()
      log.save().then(
        (r) => {
          console.log('Saved Log')
        },
        (err) => {
          console.log('ERROR while saving the log!')
        }
      )
      return res.json({
        message: 'Added Peer review for this assignment successfully',
        data: as,
      })
    },
    (err) => {
      return res.status(400).json(err)
    }
  )
}
