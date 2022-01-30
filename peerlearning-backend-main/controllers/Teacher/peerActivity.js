const peerActivity = require('../../models/peerActivity')

exports.peerActivity = function (req, res) {
  var peerAssignmentId = req.query.peer_assignment_id

  peerActivity.find({ peerAssignment_id: peerAssignmentId }, (err, result) => {
    if (err) {
      res.json(err)
    } else {
      res.status(200).json(result)
    }
  })
}

// get list of all assigned assignments on given peer_assignment_id
