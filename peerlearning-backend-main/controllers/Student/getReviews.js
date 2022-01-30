const PeerActivity = require('../../models/peerActivity')
const Assignment = require('../../models/assignment')

exports.getReviews = async (req, res) => {
  var studentID = req.query.student_id
  var peerAssignmentId = req.query.peer_assignment_id
  var empty = []

  console.log(500)
  await Assignment.findById(peerAssignmentId, (err, result) => {
    if (err) {
      res.json(err)
    } else {
      if (result.status == 'Grading') {
        PeerActivity.find(
          { peerAssignment_id: peerAssignmentId, author_id: studentID },
          (err, result) => {
            if (err) {
              res.json(err)
            } else {
              res.status(200).json(result)
            }
          }
        )
      } else {
        res.json(empty)
      }
    }
  })
}
