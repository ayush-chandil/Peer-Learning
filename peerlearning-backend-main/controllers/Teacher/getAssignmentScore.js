const { response } = require('express')
const AssignmentScore = require('../../models/assignment_score')

exports.getAssignmentScore = async (req, res) => {
  console.log(req.query)
  var assignment_id = req.query.Assignment_id
  
    console.log(req.query.Assignment_id)
 

  await AssignmentScore.find(
    { Assignment_id : assignment_id },
    async (err, result) => {
      if (err) {
        res.json(err)
      } else {
        res.status(200).send(result)
      }
    }
  )
 }

 