const peerActivity = require('../../models/peerActivity')
const axios = require('axios')
const Assignment = require('../../models/assignment')
const config = require('../../config')

exports.download = async (req, res) => {
  var peerAssignmentId = req.query.peer_assignment_id
  var courseId
  var total_questions
  let sdMap = {}

  await Assignment.findById(peerAssignmentId, (err, result) => {
    if (err) {
      return res.json(err)
    } else {
      courseId = result.course_id
      total_questions = result.total_questions
    }
  })

  await axios
    .get(`${config.app.GC_API}/courses/${courseId}/students`, {
      headers: {
        Authorization: `Bearer ${req.query.access_token}`,
      },
    })
    .then((data) => {
      data.data.students.forEach((s) => {
        sdMap[s.profile.id] = s
      })
    })
    .catch((err) => {
      console.log(err)
      return res.status(400).json({
        message:
          'Some internal error occurred while loading reviews, please try again!',
      })
    })
  let csvString = ''
  await peerActivity.find(
    { peerAssignment_id: peerAssignmentId },
    (err, result) => {
      if (err) {
        res.json(err)
      } else {
        let activities = [...result]
        activities.forEach((ac) => {
          ac.author_id = sdMap[ac.author_id].profile.emailAddress
          ac.reviewer_id = sdMap[ac.reviewer_id].profile.emailAddress
          csvString += ac.author_id
          csvString += ',' + ac.reviewer_id
          if (ac.review_score.length == 0) {
            for (let temp = 0; temp < total_questions; temp++) {
              csvString += ',,'
            }
          } else {
            for (let temp = 0; temp < total_questions; temp++) {
              csvString += ',' + ac.review_score[temp]
            }
            for (let temp = 0; temp < total_questions; temp++) {
              csvString += ',' + ac.reviewer_comment[temp]
            }
          }
          csvString += '\n'
        })
        res.setHeader(
          'Content-disposition',
          'attachment; filename=Scores_sheet.csv'
        )
        res.set('Content-Type', 'text/csv')
        res.status(200).send(csvString)
      }
    }
  )
}