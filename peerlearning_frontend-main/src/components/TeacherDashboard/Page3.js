import React, { useContext, useEffect, useState } from "react";
import { G_API, API } from "../../config";
import AuthContext from "../../AuthContext";
import { ReactComponent as AssignmentIcon } from "./Images/Assignment.svg";
import { ReactComponent as MoreIcon } from "./Images/more.svg";
import { ReactComponent as Line } from "./Images/Line.svg";
import styles from "./Page3.module.css";
import thumbnail from "./Images/thumbnail.png";
import bottom from "../../images/bottom.png";
import Spinner from "../Spinner/Spinner";

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

export default function Page3({ assg }) {
    const { userData, setUserData, setOpen, setMessage } = useContext(
        AuthContext
    );
    const [TeachersName, setTeachersName] = useState([]);
    const [spin, setspin] = useState(true);
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
                            <button className={styles.btn1}>Check for Abnormalities </button>
                            <button className={styles.btn2}>View student Reviews</button>
                            <button className={styles.btn3}>Release Scores </button>
                            <button className={styles.btn4}>View detailed Analytics </button>
                            <button className={styles.btn5}>Peer Learning activity completed </button>
                        </div>
                    </div>
                </div>}
            {<img src={bottom} alt="Image" className={styles.bottom} />}
        </>
    );
}