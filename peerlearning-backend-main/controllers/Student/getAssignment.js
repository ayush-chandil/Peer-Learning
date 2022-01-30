const Assignment = require('../../models/assignment') 

exports.getAssignment = function (req, res) {
  var courseId = req.query.course_id

  Assignment.find({ course_id: courseId }, (err, result) => {
    if (err) {
      res.json(err)
    } else {
      res.status(200).json(result)
    }
  })
}

//get all assignments on given course_id
