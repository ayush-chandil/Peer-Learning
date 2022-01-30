const Assignment = require('../../models/assignment')
const Log = require('../../models/log')

exports.closeAssignment = async (req, res) => {
  var peerAssignmentId = req.query.peer_assignment_id

  await Assignment.findById(peerAssignmentId, async (err, result) => {
    if (err) {
      res.json(err)
    } else {
      result.status = 'Grading'
      result.save((e, r) => {
        if (e) return res.json(e)
        else {
          let log = new Log()
          log.user_id = result.owner
          log.event_type = 'CLOSED_PEER_ASSIGNMENT'
          log.reference_id = peerAssignmentId
          log.description = result.assignment_title
          log.time_stamp = new Date()
          log.save().then(
            (r) => {
              console.log('Saved Log')
            },
            (err) => {
              console.log('ERROR while saving the log!')
            }
          )
          res.json({
            message: 'Assignment added to Grading Successfully!',
          })
        }
      })
    }
  }).catch((err) => {
    console.log(err)
  })
}
