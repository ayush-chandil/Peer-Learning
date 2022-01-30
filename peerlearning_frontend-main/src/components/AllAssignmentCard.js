import React, { useContext, useEffect, useState } from "react";
import '../index.css'
import AuthContext from "../AuthContext";
import { G_API, API } from "../config";
import asimg from '../images/Assignment.png';
import more from '../images/more.png';
import { useHistory } from "react-router-dom";

const AllAssignmentCard = ({ allAssignments, peerAssg, View}) => {
  // console.log(allAssignments);
  const [role, setRole] = useState("student");
  const [opt, setopt] = useState(false);
  const { userData, setUserData, setOpen, setMessage } = useContext(
    AuthContext
  );
  const history = useHistory();
  var day = '-';
  var month = '-';
  var year = '-';
  if (allAssignments.creationTime) {
    day = allAssignments.creationTime.substring(8, 10);
    month = allAssignments.creationTime.substring(5, 7);
    year = allAssignments.creationTime.substring(0, 4);
  }
  useEffect(() => {
    if (userData.token) {
      setUserData((u) => ({ ...u, loader: u.loader + 1 }));
      fetch(`${G_API}/courses/${allAssignments.courseId}/teachers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          setUserData((u) => ({ ...u, loader: u.loader - 1 }));
          res.teachers.forEach((teacher) => {
            if (teacher.profile.emailAddress === userData.user.email) {
              setRole("teacher");
            }
          });
        });
    }
  }, []);

  const f1 = () => {
    setopt(true)
  }
  var peerassId = [];
  for (let i = 0; i < peerAssg.assg.length; i++) {
    peerassId.push(peerAssg.assg[i].assignment_id);
  }
  const f2 = () => {
    if (role === "student") {
      var res = peerassId.indexOf(allAssignments.id);
      if (res == -1)
        {
          View(allAssignments.id,allAssignments.courseId);
          history.push(`/Sview1/${allAssignments.id}/${allAssignments.courseId}`);
        }
      else
        history.push(`/dashboard/${peerAssg.assg[res].course_id}/${peerAssg.assg[res]._id}`);
    }
    else {
      var res = peerassId.indexOf(allAssignments.id);
      if (res == -1)
      {
        View(allAssignments.id,allAssignments.courseId);
        history.push(`/TeacherView1/${allAssignments.id}/${allAssignments.courseId}`);
      }
      else
        history.push(`/dashboard/${peerAssg.assg[res].course_id}/${peerAssg.assg[res]._id}`);
    }
  }
  return (
    <div>
      <div onClick={f2}>
        <div className="submain">
          <div className="left-part">
            <div className="Image"><img src={asimg} alt="Assignment-Image" /></div>
            <div>
              <div className="section">{allAssignments.title}</div>
              <div className="date">{day}/{month}/{year}</div>
            </div>
          </div>
          <div className="MoreImage"><img src={more} onClick={f1} alt="More-Options" />
            <div className="options">
              <a href={allAssignments.alternateLink}>View in Classroom <i class="fa fa-external-link" aria-hidden="true"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllAssignmentCard;