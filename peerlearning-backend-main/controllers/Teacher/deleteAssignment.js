const Assignment = require('../../models/assignment')
const PeerActivity = require('../../models/peerActivity')

exports.deleteAssignment = (req, res) => {
  var peerAssignmentId = req.query.peer_assignment_id

  Assignment.findByIdAndDelete(peerAssignmentId, (err, result) => {
    if (err) {
      res.json(err)
    } else {
      console.log("Deleted Peer Assignment")
    }
  })

  PeerActivity.deleteMany({ peerAssignment_id: peerAssignmentId }, (err, result) => {
    if (err) {
      res.json(err)
    } else {
      res.status(200).json(result)
    }
  })
}
