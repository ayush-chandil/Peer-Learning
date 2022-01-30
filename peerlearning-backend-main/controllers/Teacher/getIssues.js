const Issue = require('../../models/issue')

exports.getIssues = function (req, res) {
  var peerAssignmentId = req.query.peer_assignment_id

  Issue.find({ peerAssignment_id: peerAssignmentId }, (err, result) => {
    if (err) {
      res.json(err)
    } else {
      res.status(200).json(result)
    }
  })
}

//get all issues on given peer_assignment_id
