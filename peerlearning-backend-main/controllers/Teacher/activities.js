const peerActivity = require('../../models/peerActivity')
const Assignment = require('../../models/assignment')

exports.activities = async (req, res) => {
  var courseWorkId = req.query.course_work_id
  console.log(courseWorkId)
  var peerAssignmentId

  await Assignment.findOne(
    { assignment_id: courseWorkId },
    async (err, data) => {
      if (err) {
        res.json(err)
      } else {
        console.log(data)
        peerAssignmentId = await data._id

      }
    }
  )

  await peerActivity.find(
    { peerAssignment_id: peerAssignmentId },
    async (err, result) => {
      if (err) {
        res.json(err)
      } else {
        res.status(200).json(result)
      }
    }
  )
 }