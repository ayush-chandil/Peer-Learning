import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../AuthContext";
import { G_API, API } from "../../config";
import { useHistory, useParams, useLocation } from 'react-router-dom';
import styles from './Student_View1.module.css';
import { ReactComponent as AssignmentIcon } from "../student_View/Assests/Assignment.svg";
import { ReactComponent as MoreIcon } from "../student_View/Assests/more.svg";
import { ReactComponent as Line } from "../student_View/Assests/Line.svg";
import Thumbnail from "../student_View/Assests/thumbnail.png";
import People from "../student_View/Assests/People.svg";
import bottom from "../../images/bottom.png";
import Spinner from '../Spinner/Spinner.js'

function Student_View1() {
    const [TeachersName, setTeachersName] = useState([]);
    const [spin, setspin] = useState(true);
    const [spin1, setspin1] = useState(true);
    const { userData, setUserData, setOpen, setMessage } = useContext(
        AuthContext
    );
    const [assignments, setAssignments] = useState([]);
    const location = useLocation();
    var str = location.pathname;
    var str2 = str.substring(8);
    var arr = []
    var num = 0;
    var mon;
    for (var i = 0; i < str2.length; i++) {

        if (str2[i] != "/")
            arr[num] = arr[num] + str2[i];
        else
            num++
    }
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
    // console.log(assignments);
    // console.log(assignments[r]);

    fetch(`${G_API}/courses/${Courseid}/courseWork/${userData.user.googleId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${userData.token}`,
        },
    })
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
        });

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
                                    <img id={styles.thumbnail1} src={Thumbnail} />
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
                        <div className={styles.upper}>
                            <p id={styles.work}>Your Work </p>
                            <img id={styles.people} src={People} />
                        </div>
                        <div className={styles.box1}>
                            <img id={styles.thumbnail2} src={Thumbnail} />
                            <div id={styles.written1}>
                                <p id={styles.submission}>Your Own Submission </p>
                                <p id={styles.pff}>PDF</p>
                            </div>
                        </div>
                        <a href={assignments[r].alternateLink} target="_blank">
                            <button className={styles.btn1}>Open In Classroom</button>
                        </a>
                    </div>
                </div>}
            {<img src={bottom} alt="Image" className={styles.bottom} />}
        </>
    )
}

export default Student_View1
