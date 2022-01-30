const axios = require('axios')
const Assignment = require('../../models/assignment')
const peerActivity = require('../../models/peerActivity')
const Log = require('../../models/log')
const config = require('../../config')
var p = {}
var arr = []
var v = new Map()
var temp = []
var count

// start peer learning on an assignment
exports.assignReviewers = async (req, res) => {
  var peerAssignmentId = req.query.peer_assignment_id
  var randomAssignees = req.query.random_assignees
  var courseId, courseWorkId, ownerID, title

  await Assignment.findById(peerAssignmentId, async (err, result) => {
    if (err) {
      res.json(err)
    } else {
      courseId = await result.course_id
      courseWorkId = await result.assignment_id
      ownerID = await result.owner
      title = await result.assignment_title
    }
  }).catch((err) => {
    console.log(err)
  })

  //console.log(courseId + ' ----- ' + courseWorkId)
  await axios
    .get(
      `${config.app.GC_API}/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions`,
      {
        headers: {
          Authorization: `Bearer ${req.query.access_token}`,
        },
      }
    )
    .then(async (data) => {
      temp = await [...data.data.studentSubmissions]
      //check whether randomAssignees are less than the total students
      console.log(temp.length)
      // if(randomAssignees < temp.length){
      //   return res.json({
      //     message:
      //       'Random Assignees should be lesser than the total Students, please check your input again!',
      //   })
      // }
      temp.map((submission) => {
        if (submission.state == 'TURNED_IN') {
          arr.push(submission.userId)
          //console.log(submission.assignmentSubmission.attachments[0].driveFile)
          v.set(
            submission.userId,
            submission.assignmentSubmission.attachments[0].driveFile
              .alternateLink
          )
          let activity = new peerActivity()
          activity.peerAssignment_id = peerAssignmentId
          activity.author_id = submission.userId
          activity.reviewer_id = submission.userId
          activity.material_drive_link =
            submission.assignmentSubmission.attachments[0].driveFile.alternateLink
          activity.save().then(
            (r) => {
              console.log('Self assigned!')
            },
            (err) => {
              return res.status(400).json(err)
            }
          )
        }
      })
      count = arr.length * randomAssignees
      randomize(arr, arr.length)
      output(v, arr, randomAssignees, arr.length)
      var c = 0
      arr.forEach((element) => {
        p[element].forEach((e) => {
          let activity = new peerActivity()
          activity.peerAssignment_id = peerAssignmentId
          activity.author_id = getByValue(v, e)
          activity.reviewer_id = element
          activity.material_drive_link = e

          activity.save().then(
            (r) => {
              c++
              console.log('Assigned Reviewer')
              if (c == count) {
                res.status(201).json({
                  message: 'Assigned All Reviewers Successfully!',
                })
              }
            },
            (err) => {
              return res.status(400).json({
                message:
                  'Some internal error occurred while assigning reviewer, please try again!',
              })
            }
          )
        })
      })
      p = {}
      arr = []
      temp = []
      v.clear()
      //console.log(data)
    })
    .catch((err) => {
      res.json({
        message: 'Some error occured! Please check your req again!',
      })
      console.log(err)
    })

  await Assignment.findById(peerAssignmentId, async (err, result) => {
    if (err) {
      res.json(err)
    } else {
      result.status = 'Assigned'
      result.reviewer_deadline = req.query.reviewer_deadline
      result.save((e, r) => {
        if (e) return res.json(e)
      })
      //saving log of this activity
      let log = new Log()
      log.user_id = ownerID
      log.event_type = 'STARTED_PEER_ASSIGNMENT'
      log.reference_id = peerAssignmentId
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
    }
  })

  const data = {
    courseId: courseId,
    text: `'${title}' has been assigned to you all on the Peer Learning Platform. Please complete it in due time. Link of PL app - https://serene-agnesi-9ee115.netlify.app`,
    state: 'PUBLISHED',
  }

  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${req.query.access_token}`,
    },
  }

  await axios
    .post(
      `${config.app.GC_API}/courses/${courseId}/drafts`,
      data,
      options
    )
    .then(async (responseData) => {
      console.log(responseData.data)
    })
    .catch((err) => {
      res.json({
        message: 'Some error occured while making an Announcement on Google Classroom!',
      })
      console.log(err)
    })
}

function randomize(arr, n) {
  // Use a different seed value so that
  // we don't get same result each time
  // we run this program

  // Start from the last element and swap
  // one by one. We don't need to run for
  // the first element that's why i > 0
  for (var i = n - 1; i > 0; i--) {
    var j = (Math.random() * 10000) % (i + 1) | 0

    // Swap arr[i] with the element
    // at random index
    var temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}

function output(v, arr, k, n) {
  //var p = {} //this will store email of student and k answersheet to send for checking
  for (var i = 0; i < n; i++) {
    var count = 0
    var s = []
    var j = i + 1
    while (count < k) {
      j = j % n
      var itr = v.get(arr[j])
      s.push(itr)
      count++
      j++
    }
    p[arr[i]] = s
  }
  console.log(p)
}
// Driver Code
// var v = {
//   1: 'link1',
//   2: 'link2',
//   3: 'link3',
//   4: 'link4',
//   5: 'link5',
//   6: 'link6',
//   7: 'link7',
//   8: 'link8',
// }
//input
// var arr = [1, 2, 3, 4, 5, 6, 7, 8] //emails of students
// var n = 8
// var k = 5

// randomize(arr, n)
// console.log(arr)
// output(v, arr, k, n)

function getByValue(v, searchValue) {
  for (let [key, value] of v.entries()) {
    if (value === searchValue) return key
  }
}
