import React, { useContext, useEffect, useState } from "react";
import './people.css';
import mail from '../People/images/mail.svg';
import Line from '../People/images/Line 1.svg';
import AuthContext from "../../AuthContext";
import bottom from '../../images/bottom.png'
import { G_API, API } from "../../config";
import Spinner from '../Spinner/Spinner.js'

function TeacherPeople(props) {
  const [TeachersName,setTeachersName] = useState([]);
  const [spin ,setspin] = useState(true);
  const [StudentName, setStudentName] = useState([]);
  const { userData, setUserData, setOpen, setMessage } = useContext(AuthContext);
  fetch(`${G_API}/courses/${props.teach.name.id}/teachers`, //gets the list of all teachers enrolled in the course
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    }
  )
  .then((r) => r.json())
  .then((r) => {
    setTeachersName(r.teachers);
    setspin(false);
  });
  fetch(
    `https://classroom.googleapis.com/v1/courses/${props.teach.name.id}/students`, //gets the list of all students enrolled in the course
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    }
  )
    .then((res) => res.json())
    .then((res) => {
      setStudentName(res.students);
    });
    console.log(TeachersName);
    console.log(StudentName);
    var len = StudentName.length;
    return (
      <>
        {spin ? <Spinner/> : <div className="Teachers"> Fellow Teachers
          <img src={Line} id="line" />
          {TeachersName.map((i,p) => {
            var email = TeachersName[p].profile.emailAddress;
            var mails = `mailto:${email}`;
            return(
            <>
            <div id="profile">
              <div id="left-part">
                <img src={"https:"+TeachersName[p].profile.photoUrl} id="pic" />
                <p id="name">{TeachersName[p].profile.name.fullName}</p>
              </div>
              <a href={mails} target="_blank"><img src={mail} id="mail"/></a>
            </div>
            </>
            )
            })}
          </div>}
          <div className="Teachers"> Students
          <div id="num">{len} students</div>
          <img src={Line} id="line" />
          {StudentName.map((i,p) => {
            var email = StudentName[p].profile.emailAddress;
            var mails = `mailto:${email}`;
            return(
            <>
            <div id="profile">
              <div id="left-part">
                <img src={"https:"+StudentName[p].profile.photoUrl} id="pic" />
                <p id="name">{StudentName[p].profile.name.fullName}</p>
              </div>
              <a href={mails} target="_blank"><img src={mail} id="mail"/></a>
            </div>
            </>
            )
            })}
          </div>
          {<img src={bottom} alt="Image" className="btm"/>}
        </>
    )
}

export default TeacherPeople
