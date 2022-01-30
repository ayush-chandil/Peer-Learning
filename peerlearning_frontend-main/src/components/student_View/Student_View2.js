import React, { useContext, useEffect, useState } from "react";
import { G_API, API } from "../../config";
import AuthContext from "../../AuthContext";
import styles from './Student_View2.module.css';
import { ReactComponent as AssignmentIcon } from "../student_View/Assests/Assignment.svg";
import { ReactComponent as MoreIcon } from "../student_View/Assests/more.svg";
import { ReactComponent as Line } from "../student_View/Assests/Line.svg";
import Thumbnail from "../student_View/Assests/thumbnail.png";
import People from "../student_View/Assests/People.svg";
// import Assignment from "../student_View/Assests/Assignment.svg";
import bottom from "../../images/bottom.png";
import Spinner from "../Spinner/Spinner";
import peerreviews from "../Popups/PeerReviews";
import Account from "../Popups/PopUp";
import Self from "../Popups/SelfPopup";
import Submitpop from "../Popups/Submitpop";
import FinalisePopup from "../Popups/FinalisePop";
import SelfFinalisePopup from "../Popups/selfFinalisePopup";
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

function Student_View2({ assg, self, activities, marks, setSelf, setActivities }) {
    console.log(activities);
    const { userData, setUserData, setOpen, setMessage } = useContext(
        AuthContext
    );
    const [TeachersName, setTeachersName] = useState([]);
    const [spin, setspin] = useState(true);
    const [val, setval] = useState(-1);
    const [wrapper, setwrapper] = useState(false);
    const [wrap, setwrap] = useState(false);
    const [Finalise, SetFinalise] = useState(false);
    const [selfFinalise, SetselfFinalise] = useState(false);
    const [sub, setsub] = useState(false);
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

        function count(){
            let cnt = 0;
            if(self.reviewer_comment[0] === 'yes')
                cnt++;
            for(var i=0;i<activities.length;i++){
                if(activities[i].reviewer_comment[0] === 'yes'){
                    cnt++;
                }
            }
            return cnt;
        }
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
                                    {assg.maxPoints ? <p className={styles.points}>{assg.maxPoints} Points</p> : <p className={styles.points}>Points not Assigned</p>}
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
                            <div id={styles.progress}>
                                <p id={styles.peer}>Peer review Progress </p>
                                <div id={styles.lines}>
                                    <Line id={styles.line1}/>
                                    {/* <p id={styles.reviewed}>{count()}/{activities.length+1}</p> */}
                                    <p id={styles.reviewed}>2/{activities.length+1}</p>
                                </div>
                            </div>
                            <a href={assg.alternateLink} target="_blank">
                                <button className={styles.btn1}>Open In Classroom </button>
                            </a>
                            <button className={styles.btn1}>Open Model Answer Sheet </button>
                            <button className={styles.btn1} onClick={() => SetmarksValue(true)}>View Scoring Matrix </button>
                            <button className={styles.btn2} onClick={() => setsub(true)}>Submit Reviews </button>
                        </div>
                    </div>
                    <div className={styles.Evaluation}>
                        <p id={styles.reviews}>Peer Reviews to be performed </p>
                        <div className={styles.Main}>
                            {self._id ?
                                <div id={styles.yourself}>
                                    <p id={styles.content}>Yourself </p>
                                    <a href={self.material_drive_link} target="_blank">
                                        <div id={styles.Box}>
                                            <img id={styles.thumbnail1} src={Thumbnail} />
                                            <div id={styles.written}>
                                                <p id={styles.ques}>Their Submission</p>
                                                <p id={styles.type}>PDF</p>
                                            </div>
                                        </div>
                                    </a>
                                    {
                                        self.reviewer_comment[0] === 'yes' ?
                                            <>
                                                <button id={styles.btn} disabled><p id={styles.classroom} >Score Matrix Updated</p></button>
                                                <button id={styles.btn3} disabled><p id={styles.classroom1}>Score Finalised</p></button>
                                            </> :
                                            <>
                                                <button id={styles.btn} onClick={() => setwrap(true)}><p id={styles.classroom} >Fill / Update Score Matrix</p></button>
                                                <button id={styles.btn3} onClick={() => SetselfFinalise(true)}><p id={styles.classroom1}>Finalize Score</p></button>
                                            </>
                                    }
                                </div>
                                : null}
                            {activities.map((activity, u) => (
                                <div id={styles.yourself}>
                                    <p id={styles.content}>Peer - {u + 1}</p>
                                    <a href={activities[u].material_drive_link} target="_blank">
                                        <div id={styles.Box}>
                                            <img id={styles.thumbnail1} src={Thumbnail} />
                                            <div id={styles.written}>
                                                <p id={styles.ques}>Their Submission</p>
                                                <p id={styles.type}>PDF</p>
                                            </div>
                                        </div>
                                    </a>
                                    {
                                        activity.reviewer_comment[0] === 'yes' ?
                                            <>
                                                <button id={styles.btn} disabled><p id={styles.classroom} >Score Matrix Updated</p></button>
                                                <button id={styles.btn3} disabled><p id={styles.classroom1}>Score Finalised</p></button>
                                            </> :
                                            <>
                                                <button id={styles.btn} onClick={() => { setwrapper(true); setval(u) }}><p id={styles.classroom}>Fill / Update Score Matrix</p></button>
                                                <button id={styles.btn3} onClick={() => { SetFinalise(true); setval(u)}}><p id={styles.classroom1}>Finalize Score</p></button>
                                            </>
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                </div>}
            {<img src={bottom} alt="Image" className={styles.bottom} />}
            <Account wrapperValue={wrapper} SetWrapperValue={setwrapper} marks={marks} activities={activities} setActivities={setActivities} i={val} />
            <Self wrapperValue={wrap} SetWrapperValue={setwrap} self={self} marks={marks} setSelf={setSelf} />
            <FinalisePopup Finalise={Finalise} SetFinalise={SetFinalise} activities={activities} setActivities={setActivities} i={val}/>
            <SelfFinalisePopup selfFinalise={selfFinalise} SetselfFinalise={SetselfFinalise} self={self} setSelf={setSelf} />
            <Submitpop Sub={sub} SetSub={setsub} self={self} setSelf={setSelf} activities={activities} setActivities={setActivities}/>
            <MarksPopup marksvalue={marksvalue} SetmarksValue={SetmarksValue} marks={marks} activities={activities}/>
        </>
    )
}

export default Student_View2
