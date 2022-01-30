import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../AuthContext";
import { G_API, API } from "../../config";
import Select from "react-select";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { ReactComponent as AssignmentIcon } from "./Images/Assignment.svg";
import { ReactComponent as MoreIcon } from "./Images/more.svg";
import { ReactComponent as Line } from "./Images/Line.svg";
import styles from "./Page1.module.css";
import thumbnail from "./Images/thumbnail.png";
import bottom from "../../images/bottom.png";
import Spinner from '../Spinner/Spinner.js';

export default function Page1() {
    const [TeachersName, setTeachersName] = useState([]);
    const [spin, setspin] = useState(true);
    const [spin1, setspin1] = useState(true);
    const { userData, setUserData, setOpen, setMessage } = useContext(
        AuthContext
    );
    const [questions, setQuestions] = useState(0);
    const [assignments, setAssignments] = useState([]);
    const [maxMarks, setMaxMarks] = useState([]); //for setting marks per question 
    const [reviewers, setReviewers] = useState(0); //for assigning reviewers per sheet
    const [reviewDeadline, setReviewDeadline] = useState(""); //for assigning deadline for review
    const [openDialog, setOpenDialog] = React.useState(false); //for pop up to add assignment
    const [openMarks, setOpenMarks] = useState(false);
    const [peerAssignments, setPeerAssignments] = useState([]);
    const [assignment, setAssignment] = useState({});
    const [formInput, setFormInput] = useState({
        chosenAssignment: {},
        noOfQue: "0",
        reviewersPerSheet: "0",
        reviewerDeadline: "",
        modelAns: ""
    })
    const location = useLocation();
    var str = location.pathname;
    var str2 = str.substring(14);
    var arr = []
    var num = 0;
    for (var i = 0; i < str2.length; i++) {

        if (str2[i] != "/")
            arr[num] = arr[num] + str2[i];
        else
            num++
    }
    //console.log(arr[0] + "and " + arr[1]);
    var AssignId = arr[0].substring(9);
    var Courseid = arr[1].substring(9);
    fetch(`${G_API}/courses/${Courseid}/courseWork`, { //fetch all the assignments from classrooom and store it in assignments using setAssignments
        method: "GET",
        headers: {
            Authorization: `Bearer ${userData.token}`,
        },
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.courseWork != undefined) {
                setAssignments(res.courseWork);
                setspin(false);
            }
        });
    if (assignments.length != 0) {
        for (var i = 0; i < assignments.length; i++) {
            if (assignments[i].id === AssignId) {
                var r = i;
            }
        }
    }
    if (spin == false) {
        fetch(`${G_API}/courses/${assignments[r].courseId}/teachers`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${userData.token}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                // console.log(res.teachers);
                var len = res.teachers.length;
                for (var i = 0; i < len; i++) {
                    if (res.teachers[i].userId == assignments[r].creatorUserId) {
                        var g = i;
                    }
                }
                setTeachersName(res.teachers[g].profile.name.fullName);
                setspin1(false);
            });
    }
    const handleAssignmentChange = (s) => {
        setAssignment(s);
    };

    const addPeerLearning = () => {
        if (Courseid && AssignId) {
            setUserData({ ...userData, loader: 1 });
            fetch(
                `${API}/api/assignment/add?course_id=${Courseid}&assignment_id=${AssignId}&owner=${userData.user.email}&total_questions=${questions}&access_token=${userData.token}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        course_id: Courseid,
                        assignment_id: AssignId,
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

                    fetch(`${API}/api/assignment?course_id=${Courseid}`, { //add the assignments using backend assignment module (the field of status is added by default)
                        method: "GET",
                    })
                        .then((r) => r.json())
                        .then((r) => {
                            // console.log("trying to get id");
                            // console.log(r);
                            // console.log("trying to get a");
                            r.forEach((a) => {
                                if (a.assignment_id === AssignId) {
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
    function conversion(hours, minutes) {
        var t;
        var h = hours + 5;
        var m = minutes + 30;
        if (m >= 60) {
            h = h + 1;
            m = 60 - m;
        }
        if (m < 10) {
            m = "0" + m;
        }
        if (h >= 24)
            h = h - 24;
        if (h >= 12) {
            t = 'PM';
            if (h > 12)
                h = h - 12;
        }
        else {
            t = 'AM';
            if (h < 10) {
                h = "0" + h;
            }
        }
        return h + ":" + m + " " + t;
    }
    function none(hours) {
        var t;
        var h = hours + 5;
        var m = 30;
        if (h >= 24)
            h = h - 24;
        if (h >= 12) {
            t = 'PM';
            if (h > 12)
                h = h - 12;
        }
        else {
            t = 'AM';
            if (h < 10) {
                h = "0" + h;
            }
        }
        return h + ":" + m + " " + t;
    }
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    console.log(assignments[r]);
    return (
        <>
            {spin1 ? <Spinner /> :
                <div className={styles.mainDiv}>
                    <div className={styles.contentDiv}>
                        <div>
                            <AssignmentIcon className={styles.AssgIcon} />
                        </div>
                        <div className={styles.midDiv}>
                            <h4 className={styles.AssgnName}>{assignments[r].title}</h4>
                            <p className={styles.teacher}>{TeachersName} <span className={styles.dot}>.</span> {month[(assignments[r].creationTime.substring(5, 7)) - 1]} {assignments[r].creationTime.substring(8, 10)}</p>
                            <div className={styles.pointsanddue}>
                                {assignments[r].maxPoints ? <p className={styles.points}>{assignments[r].maxPoints} Points</p> : <p className={styles.points}>Ungraded</p>}
                                <div className={styles.duediv}>
                                    {assignments[r].dueDate ? <p className={styles.due}>Due {assignments[r].dueDate.day}/{assignments[r].dueDate.month}/{assignments[r].dueDate.year}, {assignments[r].dueTime.minutes ? conversion(assignments[r].dueTime.hours, assignments[r].dueTime.minutes) : none(assignments[r].dueTime.hours)} </p> : <p className={styles.due}>No Due Date</p>}
                                </div>
                            </div>
                            <Line className={styles.line} />
                            <p className={styles.AssignmentSubtitle}>{assignments[r].description}</p>
                            {assignments[r].materials ?
                                <a href={assignments[r].materials[0].driveFile.driveFile.alternateLink} target="_blank">
                                    <div className={styles.uploadDoc}>
                                        <img id={styles.thumbnail1} src={assignments[r].materials[0].driveFile.driveFile.thumbnailUrl} />
                                        <div id={styles.written}>
                                            <p id={styles.ques}>{assignments[r].materials[0].driveFile.driveFile.title}</p>
                                            <p id={styles.type}>PDF</p>
                                        </div>
                                    </div>
                                </a> :
                                <div className={styles.uploadDoc}>
                                    <img id={styles.thumbnail1} src={thumbnail} />
                                    <div id={styles.written}>
                                        <p id={styles.ques}>No Question Paper Uploaded</p>
                                        {/* <p id={styles.type}>PDF</p> */}
                                    </div>
                                </div>
                            }
                        </div>
                        <div className={styles.moreIcon}>
                            <MoreIcon />
                        </div>
                    </div>
                    <div className={styles.pdfDiv}>
                        <a href={assignments[r].assignment.studentWorkFolder.alternateLink} target="_blank">
                            <button className={styles.btn1}>View student Submissions</button>
                        </a>
                        <div>
                            <button className={styles.btn2} onClick={handleClickOpen}>Activate Peer Learning </button>
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
                        </div>
                    </div>
                </div>}
            {<img src={bottom} alt="Image" className={styles.bottom} />}
        </>
    );
}