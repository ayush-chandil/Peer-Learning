const Issue = require('../../models/issue')
const peerActivity = require('../../models/peerActivity')
const Assignment = require('../../models/assignment')
const Log = require('../../models/log')

exports.addIssue = async (req, res) => {
  var peerActivityId = req.body.peer_activity_id,
    newIssue = {
      time: new Date(),
      user_id: req.body.user_id,
      comment: req.body.comment,
    }
  var peerAssignmentId,
    flag = false

  await peerActivity.findById(peerActivityId, async (err, result) => {
    if (err) {
      res.json(err)
    } else {
      peerAssignmentId = await result.peerAssignment_id
    }
  })

  await Assignment.findById(peerAssignmentId, async (err, result) => {
    if (err) {
      res.json(err)
    } else {
      title = await result.assignment_title
    }
  })

  await Issue.findOne(
    { peerAssignment_id: peerAssignmentId },
    (err, result) => {
      if (err) {
        res.json(err)
      } else {
        if (!result) {
          let issue = new Issue()
          issue.peerAssignment_id = peerAssignmentId
          issue.peerActivity_id = peerActivityId
          issue.issues.push(newIssue)
          issue.save().then(
            (r) => {
              let log = new Log()
              log.user_id = req.body.user_id
              log.event_type = 'ADDED_ISSUE'
              log.reference_id = issue._id
              log.description = title
              log.time_stamp = new Date()
              log.save().then(
                (r) => {
                  console.log('Saved Log')
                },
                (err) => {
                  console.log('ERROR while saving the log!')
                }
              )
              return res.json({
                message: 'Created new issue successfully!',
              })
            },
            (err) => {
              return res.status(400).json(err)
            }
          )
        } else {
          flag = true
        }
      }
    }
  ).then(() => {
    if (flag) {
      Issue.findOneAndUpdate(
        { peerAssignment_id: peerAssignmentId },
        { $push: { issues: newIssue } },
        function (error, success) {
          if (error) {
            console.log(error)
          } else {
            let log = new Log()
            log.user_id = req.body.user_id
            log.event_type = 'ADDED_ISSUE'
            log.reference_id = success._id
            log.description = title
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
              message: 'Added issue successfully!',
            })
          }
        }
      )
    }
  })
}

//add issue on given peer_activity_id
