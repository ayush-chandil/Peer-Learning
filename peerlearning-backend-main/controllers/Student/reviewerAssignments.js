const peerActivity = require('../../models/peerActivity')
const Assignment = require('../../models/assignment')

exports.reviewerAssignments = async (req, res) => {
  var courseWorkId = req.query.course_work_id
  var userId = req.query.user_id
  var peerAssignmentId

  let data = await Assignment.findOne({ assignment_id: courseWorkId })
  peerAssignmentId = data._id
  // await Assignment.findOne(
  //   { assignment_id: courseWorkId },
  //   async (err, data) => {
  //     if (err) {
  //       res.json(err)
  //     } else {
  //       peerAssignmentId = await data._id
  //     }
  //   }
  // )

  console.log(peerAssignmentId);
  console.log(userId);
  await peerActivity.find(
    { peerAssignment_id: peerAssignmentId, reviewer_id: userId },
    async (err, result) => {
      if (err) {
        res.json(err)
      } else {
        res.status(200).json(result)
      }
    }
  )
}
