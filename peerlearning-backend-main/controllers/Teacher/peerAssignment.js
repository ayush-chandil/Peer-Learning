const Assignment = require('../../models/assignment')

exports.peerAssignment = function (req, res) {
  var id = req.query.peer_assignment_id

  Assignment.findById(id, (err, result) => {
    if (err) {
      res.json(err)
    } else {
      res.status(200).json(result)
    }
  })
}

//get detailed information on that peer assignment
