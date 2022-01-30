const axios = require('axios')
const AssignmentScore = require('../../models/assignment_score')

exports.addAssignmentScore = async (req, res) => {
    var assignment_score = req.body;
    AssignmentScore.create(assignment_score, function(er, data) {
        if(er) {
            console.log(er);
        }
        else {
            res.status(200).json(data);
        }
        
    })

    console.log("reached")
//   let  = new AssignmentScore()
//   assignment_score.user_id = req.body.User_id
//   assignment_score.assignment_id = req.body.Assignment_id
//   assignment_score.aconst = req.body.Aconst
//   assignment_score.final_grade = req.body.final_grade
  
//   assignment_score.save().then(
//       console.log("Assignment score saved")
//   )
 

}