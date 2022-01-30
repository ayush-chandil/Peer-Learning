import React, { useContext, useEffect, useState } from "react";
import { G_API, API } from "../../config";
import AuthContext from "../../AuthContext";
import styles from './Student_View3.module.css';
import { ReactComponent as AssignmentIcon } from "../student_View/Assests/Assignment.svg";
import { ReactComponent as MoreIcon } from "../student_View/Assests/more.svg";
import { ReactComponent as Line } from "../student_View/Assests/Line.svg";
import Thumbnail from "../student_View/Assests/thumbnail.png";
import People from "../student_View/Assests/People.svg";
import Graph from "../student_View/Assests/Graph.svg";
import bottom from "../../images/bottom.png";
import Spinner from "../Spinner/Spinner";
import MarksPopup from "../Popups/MarksPopup";

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

function Student_View3({ assg, activities, marks, setActivities }) {
    console.log(assg);
    console.log(activities);
    console.log(marks);
    const { userData, setUserData, setOpen, setMessage } = useContext(
        AuthContext
    );
    const [TeachersName, setTeachersName] = useState([]);
    const [spin, setspin] = useState(true);
    const [marksvalue, SetmarksValue] = useState(false);
    fetch(`${G_API}/courses/${assg.courseId}/teachers`, {
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
                if (res.teachers[i].userId == assg.creatorUserId) {
                    var g = i;
                }
            }
            setTeachersName(res.teachers[g].profile.name.fullName);
            setspin(false);
        });

    var marksum=0;
    for(var i=0;i<marks.length;i++){
        marksum = marksum + marks[i];
    }
    
    var sum=0;
    var x=0;
    return (
        <>
            {spin ? <Spinner /> :
                <div>
                    <div className={styles.mainDiv}>
                        <div className={styles.contentDiv}>
                            <div>
                                <AssignmentIcon className={styles.AssgIcon} />
                            </div>
                            <div className={styles.midDiv}>
                                <h4 className={styles.AssgnName}>{assg.assignment_title}</h4>
                                <p className={styles.teacher}>{TeachersName} <span className={styles.dot}>.</span> {month[(assg.creationTime.substring(5, 7)) - 1]} {assg.creationTime.substring(8, 10)}</p>
                                <div className={styles.pointsanddue}>
                                    {assg.maxPoints ? <p className={styles.points}>{assg.maxPoints} Points</p> : <p className={styles.points}>Ungraded</p>}
                                    <div className={styles.duediv}>
                                    {assg.dueDate ? <p className={styles.due}>Due {assg.dueDate.day}/{assg.dueDate.month}/{assg.dueDate.year}, {assg.dueTime.minutes ? conversion(assg.dueTime.hours, assg.dueTime.minutes) : none(assg.dueTime.hours)} </p> : <p className={styles.due}>No Due Date</p>}
                                    </div>
                                </div>
                                <Line className={styles.line} />
                                <p className={styles.AssignmentSubtitle}>{assg.description}</p>
                                {assg.materials ?
                                    <a href={assg.materials[0].driveFile.driveFile.alternateLink} target="_blank">
                                        <div className={styles.uploadDoc}>
                                            <img id={styles.thumbnail1} src={assg.materials[0].driveFile.driveFile.thumbnailUrl} />
                                            <div id={styles.written}>
                                                <p id={styles.ques}>{assg.materials[0].driveFile.driveFile.title}</p>
                                                <p id={styles.type}>PDF</p>
                                            </div>
                                        </div>
                                    </a> :
                                    <div className={styles.uploadDoc}>
                                        <img id={styles.thumbnail2} src={Thumbnail} />
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
                            <div id={styles.progress}>
                                <p id={styles.peer}>Peer review Progress </p>
                                <div id={styles.lines}>
                                    <Line id={styles.line1} />
                                    <p id={styles.reviewed}>6/6</p>
                                </div>
                            </div>
                            <a href={assg.alternateLink} target="_blank">
                                <button className={styles.btn1}>Open In Classroom </button>
                            </a>
                            <button className={styles.btn1}>Open Model Answer Sheet </button>
                           <button className={styles.btn1} onClick={() => SetmarksValue(true)}>View Scoring Matrix </button>
                            <button className={styles.btn2}>View Detailed Analytics</button>
                            <button className={styles.btn3}>Reviews Completed</button>
                        </div>
                    </div>
                    <div className={styles.lower}>
                        <p id={styles.consistency}>Your Assignment Consistency score </p>
                        {/* <img id={styles.graph" src={Graph}/> */}
                        <p id={styles.Reviews}>Peer Reviews performed </p>
                            <div className={styles.performed}>
                                <div>
                                    <p id={styles.rev}>Reviews Performed </p>
                                </div>
                                <div id={styles.allreviews}>
                                    {activities.map((activity,j) => (
                                        <>
                                        {(j==0) ?
                                            <div id={styles.report}>
                                                <div id={styles.nameandmarks}>
                                                    <p id={styles.aa}>Yourself</p>
                                                    {activities[j].review_score.map((score)=>{
                                                        sum += score;
                                                    })}
                                                    <p id={styles.marks}>{sum}/{marksum}</p>
                                                </div>
                                                <button className={styles.btn4}>View questionwise Report</button>
                                            </div>
                                        :
                                        <div id={styles.report}>
                                                <div id={styles.nameandmarks}>
                                                    <p id={styles.aa}>Peer {j}</p>
                                                    {activities[j].review_score.map((score)=>{
                                                        x += score;
                                                    })}
                                                    <p id={styles.marks}>{sum}/{marksum}</p>
                                                </div>
                                                <button className={styles.btn4}>View questionwise Report</button>
                                            </div>
                                        }
                                        </>
                                    ))}
                            </div>
                        </div>
                        <p id={styles.Reviews}>Peer Reviews recieved </p>
                            <div className={styles.performed}>
                                <div>
                                    <p id={styles.rev}>Reviews Received </p>
                                </div>
                                <div id={styles.allreviews}>
                                    {activities.map((activity,j) => (
                                        <>
                                        {(j==0) ?
                                            <div id={styles.report}>
                                                <div id={styles.nameandmarks}>
                                                    <p id={styles.aa}>Yourself</p>
                                                    <p id={styles.marks}>{activities[0].review_score[0]}/{marksum}</p>
                                                </div>
                                                <button className={styles.btn4}>View questionwise Report</button>
                                            </div>
                                        :
                                        <div id={styles.report}>
                                                <div id={styles.nameandmarks}>
                                                    <p id={styles.aa}>Peer {j}</p>
                                                    <p id={styles.marks}>{activities[j].review_score[0]}/{marksum}</p>
                                                </div>
                                                <button className={styles.btn4}>View questionwise Report</button>
                                            </div>
                                        }
                                        </>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>}
            {<img src={bottom} alt="Image" className={styles.bottom} />}
            <MarksPopup marksvalue={marksvalue} SetmarksValue={SetmarksValue} marks={marks} activities={activities}/>
        </>
    )
}

export default Student_View3
