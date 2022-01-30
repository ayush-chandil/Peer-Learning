import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../AuthContext";
import { G_API, API } from "../../config";
import Form1 from './form1';
import Form2 from './form2';
import banner from './ban.png';
import styles from './Formfull.module.css';
import AssignmentCard from '../AssignmentCard'
import bottom from '../../images/bottom.png'
import AllAssignmentCard from '../AllAssignmentCard';
import Nav from '../Navbar/Nav';
import peep from '../../images/People.png';
import { History } from "history";
import { useHistory } from "react-router-dom";
import People from "../People/People";

const Formfull = (prop) => {
  // console.log(prop);
  const [TeachersName, setTeachersName] = useState([]);
  const [tf, settf] = useState(true);
  // const [tRole, settRole] = useState(true);
  const [Role, setRole] = useState("student");
  const { userData, setUserData, setOpen, setMessage } = useContext(AuthContext);
  const history = useHistory();
  var idArr = [];
  if (prop.allassg) {
    for (var i = 0; i < prop.allassg.length; i++) {
      idArr.push(prop.allassg[i].id);
    }
  }

  fetch(`${G_API}/courses/${prop.name.id}/teachers`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${userData.token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      var len = res.teachers.length;
      // console.log(res.teachers[len-1].profile.name.fullName);
      setTeachersName(res.teachers[len - 1].profile.name.fullName);
    });
  // console.log(TeachersName);
  const [css, setcss] = useState(false);
  const [under, setunder] = useState(false);
  let name = "";
  if (prop.assg.length != 0) {
    name = prop.assg[0].course_name;
  }
  const f1 = () => {
    setcss(true)
  }
  const f2 = () => {
    setcss(false)
  }

  function funpeople() {
    settf(false);
    setunder(true);
  }

  function Assign() {
    settf(true);
    setunder(false);
  }

  return (
    <>
      <div className={styles.topBtn}>
        <span onClick={() => Assign()} className={under ? styles.notu : styles.u}>Stream</span>
        <span onClick={() => funpeople()} className={under ? styles.u : styles.notu}>People</span>
      </div>
      {
        tf ?
          <div>
            <div className={styles.banner}>
              <img src={banner} alt="Image" className={styles.img}></img>
              <p style={{ marginTop: "-104.88px", paddingLeft: "32px", fontWeight: "600", paddingBottom: "15px", color: "white", fontSize: "36px", lineHeight: "43.88px" }}>{prop.name.name}</p>
              <div style={{ marginTop: "-24px", paddingLeft: "32px", display: "flex" }}>
                <p style={{ fontWeight: "500", color: "white", fontSize: "22px", lineHeight: "26.82px", paddingRight: "24px" }}>{TeachersName} </p>
                <img onClick={() => funpeople()} src={peep} alt="Image" style={{ width: "25px", height: "24px", cursor: "pointer" }} />
              </div>
            </div>
            <div className={styles.container}>
              <div className={styles.form}>
                <div className={styles.formBtn}>
                  <span onClick={f2} className={css ? styles.not : styles.underline}>Peer Learning Assignments</span>
                  <span onClick={f1} className={css ? styles.underline : styles.not}>All Assignments</span>
                </div>
                {css ?
                  <div className="assignment_list" style={{ marginTop: "20px" }} >
                    {/* if not display the msg no assignments */}
                    {prop.allassg ? (<>
                      {prop.allassg.map((p) => (
                        <AllAssignmentCard allAssignments={p} peerAssg={prop} View={prop.studentsView}/>
                      ))
                      }
                    </>
                    ) : (
                      <div className="null_assignment" style={{ marginLeft: "50%", marginTop: "50px" }}>
                        <img src="images/noassign.jpg" alt="logo" width="400" height="250" />
                        <h3 className={styles.heading}>No assignment is uploaded on selected course</h3>
                      </div>)}
                  </div>
                  :
                  <div className="assignment_list" style={{ marginTop: "20px" }} >
                    {/* if not display the msg no assignments */}
                    {prop.assg.length === 0 ? (
                      <div className="null_assignment" style={{ marginLeft: "50%", marginTop: "50px" }}>
                        <img src="images/noassign.jpg" alt="logo" width="400" height="250" />
                        <h3 className={styles.heading}>No assignment with peer review on selected course</h3>
                      </div>
                    ) : (<>
                      {prop.assg.map((p) => (
                        <AssignmentCard key={p._id} data={p} ids={idArr} />
                      ))
                      }
                    </>)}

                  </div>}
              </div>
            </div>
            {<img src={bottom} alt="Image" className={styles.bottom} />}
          </div> :
          <div>
            {Role == "student" ? <div><People teach={prop} /></div> : <div>other</div>}
          </div>
      }
    </>
  )
}

export default Formfull
