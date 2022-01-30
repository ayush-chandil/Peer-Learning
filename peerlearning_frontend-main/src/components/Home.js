import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../AuthContext";
import { G_API, API } from "../config";
import Select from "react-select";
import CourseCard from "./CourseCard";
import AssignmentCard from "./AssignmentCard";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';
import bottom from '../images/bottom.png';
import cal from '../images/Calendar.png';
import query from '../images/Query.png';
import todo from '../images/To-do.png';
import Formfull from '../components/Assignments/Formfull'
import TeacherFormfull from './Assignments/TeacherFormfull'
import { Link as RouterLink } from "react-router-dom";
import Nav from "./Navbar/Nav";
import Calendar from "./Calendar/Calendar";
import rev from "../images/Review.png";

const Plotly = window.Plotly
const Home = ({course,setCourse,studentsView,TeachersView}) => {
  const { userData, setUserData, setOpen, setMessage } = useContext(
    AuthContext
  );

  const [Url, setUrl] = useState([]);
  const [Cal, setCal] = useState(true);
  const [userId, setuserId] = useState([]);
  const [courses, setCourses] = useState([]); //for storing active courses for logged in user
  const [assignments, setAssignments] = useState([]); //for storing all the assignments for a particular course
  const [peerAssignments, setPeerAssignments] = useState([]); //for fetching already added peer assignments from backend to frontend
  // const [course, setCourse] = useState({});
  const [assignment, setAssignment] = useState({}); //for choosing an assignment while adding an assignment to peer learning
  const [role, setRole] = useState("student"); //after comparing the email address for teacher in a selected course change role accordingly
  const [questions, setQuestions] = useState(0); //for setting no. of questions for an assignment
  const [maxMarks, setMaxMarks] = useState([]); //for setting marks per question 
  const [reviewers, setReviewers] = useState(0); //for assigning reviewers per sheet
  const [reviewDeadline, setReviewDeadline] = useState(""); //for assigning deadline for review
  const [openDialog, setOpenDialog] = React.useState(false); //for pop up to add assignment
  const [openMarks, setOpenMarks] = useState(false);

  let imgArr = ["Banner1.png", "Banner2.png", "Banner3.png", "Banner4.png", "Banner5.png"];

  const [formInput, setFormInput] = useState({
    chosenAssignment: {},
    noOfQue: "0",
    reviewersPerSheet: "0",
    reviewerDeadline: "",
    modelAns: ""
  })

  let all = {
    ids: [],
    names: [],
    photos: []
  };
  var teach =  [];
  var stud =  [];
  let arr1 = [];
  let ram1 = 0;
  let ram2 = "";
  let ram3 = "";
  let teachercount = 0;

  useEffect(() => {
    if (userData.token) {
      // console.log("User data before fetching active courses", userData);
      setUserData((u) => ({ ...u, loader: u.loader + 1 }));
      fetch(`${G_API}/courses?courseStates=ACTIVE`, {  // fetch active courses for a user and store it inside courses 
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setUserData((u) => ({ ...u, loader: u.loader - 1 }));
          setCourses(res.courses);
          let len = res.courses.length;
          for (let qal = 0; qal < len; qal++) {
          fetch(`${G_API}/courses/${res.courses[qal].id}/teachers`, {
              //fetch the teachers of that course
              method: "GET",
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
            })
            .then((res) => res.json())
            var st1 = res.courses[qal].id;
            all.ids.push(st1);
          }
          let arr=[];
          for (let qal = 0; qal < len; qal++) {
            fetch(`${G_API}/courses/${res.courses[qal].id}/teachers`, { //fetch the teachers of that course
              method: "GET",
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
            })
              .then((res) => res.json())
              .then((res) => {
                // console.log(res.teachers);
                ram1 = res.teachers.length;
                //ram2 = res.teachers[ram1 - 1].profile.photoUrl;
                ram3 = res.teachers[ram1 - 1].profile.name.fullName;
                // console.log(res.teachers[ram1 - 1].userId);
                for (let temp = 0; temp < ram1; temp++) {
                  arr1.push(res.teachers[temp].userId);
                }
                //all.photos.push(ram2);
                all.names.push(ram3);
              });
          }
          for (let qal = 0; qal < len; qal++) {
            fetch(`${G_API}/courses/${res.courses[qal].id}/teachers`, { //fetch the teachers of that course
              method: "GET",
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
            })
              .then((res) => res.json())
              .then((res) => {
                // console.log(res.teachers);
                ram1 = res.teachers.length;
                ram2 = res.teachers[ram1 - 1].profile.photoUrl;
                // ram3 = res.teachers[ram1 - 1].profile.name.fullName;
                // console.log(res.teachers[ram1 - 1].userId);
                for (let temp = 0; temp < ram1; temp++) {
                  arr1.push(res.teachers[temp].userId);
                }
                all.photos.push(ram2);
                // arr.push(ram3);
              });
          }
        });
    }
    setUrl(all);
    setuserId(arr1);
  }, [userData.token]);

  //if course id is chosen and a user is logged in successfully
  useEffect(() => {
    if (userData.token && course.id) {
      setUserData((u) => ({ ...u, loader: u.loader + 1 }));
      fetch(`${G_API}/courses/${course.id}/teachers`, { //fetch the teachers of that course and check if user if a teacher or student and store the role in role using setRole
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setUserData((u) => ({ ...u, loader: u.loader - 1 }));
          res.teachers.forEach((teacher) => {
            if (teacher.profile.emailAddress === userData.user.email) {
              setRole("teacher");
            }
          });
        });

      setUserData((u) => ({ ...u, loader: u.loader + 1 }));
      fetch(`${G_API}/courses/${course.id}/courseWork`, { //fetch all the assignments from classrooom and store it in assignments using setAssignments
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setAssignments(res.courseWork);
          //console.log(assignments);
          let assignmentMap = {};
          if (res.courseWork !== undefined) {
            res.courseWork.forEach((c) => {
              assignmentMap[c.id] = c;
            });
          }

          fetch(`${API}/api/assignment?course_id=${course.id}`, { //add the assignments using backend assignment module (the field of status is added by default)
            method: "GET",
          })
            .then((r) => r.json())
            .then((r) => {
              setUserData((u) => ({ ...u, loader: u.loader - 1 }));
              let tt = [];
              r.forEach((t) => {
                tt.push({ ...t, ...assignmentMap[t.assignment_id] });
              });
              setPeerAssignments(tt);
              // console.log(peerAssignments);
            });
          // const results = arrayOne.filter(({ value: id1 }) => !arrayTwo.some(({ value: id2 }) => id2 === id1));
        });

      // Api's chart
      // fetch(`${API}/api/plot8?courseID=${course.id}&studentID=${userData.user.googleId}`, {
      //   method: "GET"
      // })
      //   .then((res) => res.json())
      //   .then((res) => {
      //     //console.log(res);
      //     var ele = document.querySelector('#student');
      //     Plotly.newPlot(ele, res.data, res.layout, res.config);
      //   })

      // fetch(`${API}/api/plot8?courseID=249509627957&studentID=101973615462290612505`, {
      //   method: "GET"
      // })
      //   .then((res) => res.json())
      //   .then((res) => {
      //     // console.log(res);
      //     var ele = document.querySelector('#faculty');
      //     Plotly.newPlot(ele, res.data, res.layout, res.config);
      //   })

    }
  }, [course.id]);

  const handleAssignmentChange = (s) => {
    setAssignment(s);
  };

  const addPeerLearning = () => {
    if (course.id && assignment.id) {
      // console.log(assignment);
      // console.log(course);
      // console.log(course.id, assignment.id, userData.user.email, questions, maxMarks);
      setUserData({ ...userData, loader: 1 });
      fetch(
        `${API}/api/assignment/add?course_id=${course.id}&assignment_id=${assignment.id}&owner=${userData.user.email}&total_questions=${questions}&access_token=${userData.token}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            course_id: course.id,
            assignment_id: assignment.id,
            owner: userData.user.email,
            total_questions: questions,
            max_marks_per_question: maxMarks,
            access_token: userData.token,
          }),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          setOpen(true);
          setMessage("Successfully added peer learning on this assignment");
          // setUserData({ ...userData, loader: 0 });
          // console.log("Successfully added peer learning");
          setPeerAssignments((p) => [...p, { ...res.data, ...assignment }]);

          fetch(`${API}/api/assignment?course_id=${course.id}`, { //add the assignments using backend assignment module (the field of status is added by default)
            method: "GET",
          })
            .then((r) => r.json())
            .then((r) => {
              // console.log("trying to get id");
              // console.log(r);
              // console.log("trying to get a");
              r.forEach((a) => {
                if (a.assignment_id === assignment.id) {
                  const id = a._id;
                  // setUserData((u) => ({ ...u, loader: u.loader + 1 }));
                  fetch(
                    `${API}/api/assignreviewers?peer_assignment_id=${id}&random_assignees=${reviewers}&access_token=${userData.token}&reviewer_deadline=${reviewDeadline}`,
                    {
                      method: "POST",
                    }
                  )
                    .then((res) => res.json())
                    .then(
                      (res) => {
                        // setUserData((u) => ({ ...u, loader: u.loader - 1 }));
                        setOpen(true);
                        setMessage("Successfully assigned reviewers");
                        // console.log(res);

                      },
                      (err) => {
                        // setUserData((u) => ({ ...u, loader: u.loader - 1 }));
                        setOpen(true);
                        setMessage("Something went wrong while assigning");
                      }
                    );
                }
              });
            });
          setUserData({ ...userData, loader: 0 });
        })
        .catch((err) => {
          setUserData({ ...userData, loader: 0 });
          console.log(err);
          setOpen(true);
          setMessage("Something went wrong while adding peer review");
        });
    }
  };

  const handleMaxMarksChange = (index, value) => {
    let k = maxMarks;
    k[index] = Math.max(0, Number(value));
    setMaxMarks([...k]);
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setQuestions(0);
    setMaxMarks([]);
    setFormInput({ chosenAssignment: "", noOfQue: "0", reviewersPerSheet: "0", reviewerDeadline: "", modelAns: "" });
    setReviewers(0);
    setReviewDeadline("");
    setAssignment({});
    setOpenDialog(false);
  };

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormInput({ ...formInput, [name]: value })
    if (name === "noOfQue") {
      const que = formInput.noOfQue;
      if (que < value) {
        setQuestions(formInput.noOfQue);
        setOpenMarks(true);
        setMaxMarks((m) => [...m, 1]);

      }
      if (que > value) {
        setQuestions(questions - 1);
        maxMarks.pop();
        setMaxMarks(maxMarks);
      }
    }
    if (name === "reviewersPerSheet") {
      setReviewers(parseInt(e.target.value))
    }
    if (name === "reviewerDeadline") {
      setReviewDeadline(new Date(e.target.value).toISOString());
      // console.log(reviewDeadline);
      // console.log(formInput.reviewerDeadline);
    }
    // if (name === "modelAns") {
    //   console.warn("file data", e.target.files);
    // }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    addPeerLearning();
    handleClose();
  };

  const handleMarksSubmit = () => {
    setOpenMarks(false);
  }

  const handleMarksClose = () => {
    setOpenMarks(false);
    setQuestions(questions - 1);
    setFormInput({ ...formInput, noOfQue: questions })

    maxMarks.pop();
    setMaxMarks(maxMarks);
  };
  // console.log(courses);
  if(courses.length !=0 )
  {
    if(courses[0].teacherFolder)
    {
      teachercount = 1;
    }
  }
  return (
    <div>
      {/* if course is selected */}
      {course.id ? (
        <>
          {role === "teacher" && (
            <>
            {/* <div>
                <Button variant="outlined" style={{ color: "#1E4FA0", borderRadius: "15px", backgroundColor: "white", marginTop: "100px" }} onClick={handleClickOpen}>
                    <AddCircleIcon style={{ color: "#1E4FA0", marginRight: "10px" }} /> Add New Assignment
                </Button>
                <Dialog open={openDialog} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Create New Assignment</DialogTitle>
                    <DialogContent style={{ height: "270px", marginTop: "10px" }}>
                        <p>Choose An Assignment:</p>
                        <div style={{ width: "200px", height: "50px", marginTop: "-45px", marginLeft: "200px" }}>
                            <Select
                                value={assignment}
                                options={assignments}
                                getOptionLabel={(option) => option.title}
                                getOptionValue={(option) => option.id}
                                onChange={handleAssignmentChange}
                                rules={{ required: 'Please select an option' }} />
                        </div>
                        <form action="" onSubmit={handleFormSubmit}>
                            <div style={{ margin: "10px" }}>
                                <p style={{ marginLeft: "31px" }}>No. of Questions:</p>
                                <div style={{ marginTop: "-43px", marginLeft: "190px" }}>
                                    <input style={{ width: "60px" }} type="number" name="noOfQue" min="0" value={formInput.noOfQue} onChange={handleInput} required />
                                </div>
                                {maxMarks.map((m, index) => (
                                    <Dialog open={openMarks} onClose={handleMarksClose} aria-labelledby="form-dialog-title">
                                        <DialogTitle id="form-dialog-title">Enter Marks</DialogTitle>
                                        <DialogContent>
                                            <input style={{ width: "60px" }} type="number" min="0" name="noOfQue" value={m}
                                                onChange={(e) => { handleMaxMarksChange(index, e.target.value); }}
                                                required />
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleMarksClose} color="primary"> Cancel </Button>
                                            <Button onClick={handleMarksSubmit} color="primary"> Set Marks </Button>
                                        </DialogActions>
                                    </Dialog>
                                ))}
                            </div>
                            <div style={{ margin: "20px" }}>
                                <p>Reviewers Per Sheet:</p>
                                <div style={{ marginTop: "-41px", marginLeft: "180px" }}>
                                    <input style={{ width: "60px" }} type="number" name="reviewersPerSheet" min="0" value={formInput.reviewersPerSheet} onChange={handleInput} required />
                                </div>
                            </div>
                            <div style={{ margin: "15px" }}>
                                <p style={{ marginLeft: "28px" }}>Review Deadline:</p>
                                <div style={{ marginTop: "-40px", marginLeft: "185px" }}>
                                    <input style={{ width: "200px" }} type="datetime-local"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        name="reviewerDeadline"
                                        value={formInput.reviewerDeadline}
                                        onChange={handleInput}
                                    />
                                </div>
                            </div>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">Cancel </Button>
                                <Button type="submit" color="primary"> Add Assignment </Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>
            </div> */}
            <div>
              <TeacherFormfull assg={peerAssignments} allassg={assignments} name={course} handleClose={handleClose} handleInput={handleInput} 
              dead={formInput.reviewerDeadline} review={formInput.reviewersPerSheet} close={handleMarksClose} submit={handleMarksSubmit} 
              change={handleMaxMarksChange} clickopen={handleClickOpen} dialog={openDialog} val={assignment} opt={assignments} handlechange={handleAssignmentChange}
              formsubmit={handleFormSubmit} max={maxMarks} finput={formInput} openm={openMarks} TeachersView={TeachersView}/>
            </div>
            </>
          )}

          {role === "student" && (
            <div>
              <Formfull assg={peerAssignments} allassg={assignments} name={course} studentsView={studentsView}/>
            </div>
          )}
        </>
      ) : ( // Select Course //course_list
        <>
          <div className="main">
            <div className="head">
              <button className="btm3"><img src={query} alt="Queries" /> Queries</button>
              <RouterLink to="/Assigned">
                <button className="btm3"><img src={todo} alt="Todos" /> To-Do</button>
              </RouterLink>
              <RouterLink to="/Calendar">
              <button className="btm3"><img src={cal} alt="Calendar"/> Calendar</button>
              </RouterLink>
              {
                teachercount !=0 ?
                <button className="btm3"><img src={rev} alt="Review" /> Review</button> :
                <p style={{color:'white',marginBottom:'-20px'}}> Hello </p>
              }
            </div>
            {courses.map((c,index,len) => (
              <CourseCard data={c} index={index} length={len} setCourse={setCourse} key={c.id} image={imgArr[index % 5]}/>
            ))}
            </div>
          {<img src={bottom} alt="Image" className="bottom" />}
        </>
      )}
    </div>
  );
};

export default Home;