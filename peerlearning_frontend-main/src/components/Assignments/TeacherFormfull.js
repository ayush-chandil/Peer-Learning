import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../AuthContext";
import { G_API, API } from "../../config";
import banner from './ban.png';
import styles from './Formfull.module.css';
import AssignmentCard from '../AssignmentCard'
import bottom from '../../images/bottom.png'
import AllAssignmentCard from '../AllAssignmentCard';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Select from "react-select";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import TeacherPeople from "../People/TeacherPeople";
import peep from '../../images/People.png';

const TeacherFormfull = (prop) => {
    console.log(prop);
    var idArr = [];
    if (prop.allassg) {
    for (var i = 0; i < prop.allassg.length; i++) {
      idArr.push(prop.allassg[i].id);
    }
    }
    const [tf, settf] = useState(true);
    const [Role, setRole] = useState("teacher");
    const [TeachersName, setTeachersName] = useState([]);
    const { userData, setUserData, setOpen, setMessage } = useContext(AuthContext);
    fetch(`${G_API}/courses/${prop.name.id}/teachers`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${userData.token}`,
        },
    })
        .then((res) => res.json())
        .then((res) => {
            var len = res.teachers.length;
            // console.log(res.teachers[len - 1].profile.name.fullName);
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
                            {prop.allassg.length === 0 ? (
                                <div className="null_assignment" style={{ marginLeft: "50%", marginTop: "50px" }}>
                                    <img src="images/noassign.jpg" alt="logo" width="400" height="250" />
                                    <h3 className={styles.heading}>No assignment on selected course</h3>
                                </div>
                            ) : (<>
                                <div>
                                    <Button variant="outlined" style={{ color: "#1E4FA0",borderRadius: "15px", backgroundColor: "white", marginTop: "0px", marginLeft:"50%"}} onClick={prop.clickopen}>
                                        <AddCircleIcon style={{ color: "#1E4FA0", marginRight: "20px",marginLeft:"40px",textAlign:"center"}}/> Add New Peer Assignment
                                    </Button>
                                    <Dialog open={prop.dialog} onClose={prop.handleClose} aria-labelledby="form-dialog-title">
                                        <DialogTitle id="form-dialog-title">Create New Assignment</DialogTitle>
                                        <DialogContent style={{ height: "270px", marginTop: "10px" }}>
                                            <p>Choose An Assignment:</p>
                                            <div style={{ width: "200px", height: "50px", marginTop: "-45px", marginLeft: "200px" }}>
                                                <Select
                                                    value={prop.val}
                                                    options={prop.opt}
                                                    getOptionLabel={(option) => option.title}
                                                    getOptionValue={(option) => option.id}
                                                    onChange={prop.handlechange}
                                                    rules={{ required: 'Please select an option' }} />
                                            </div>
                                            <form action="" onSubmit={prop.formsubmit}>
                                                <div style={{ margin: "10px" }}>
                                                    <p style={{ marginLeft: "31px" }}>No. of Questions:</p>
                                                    <div style={{ marginTop: "-43px", marginLeft: "190px" }}>
                                                        <input style={{ width: "60px" }} type="number" name="noOfQue" min="0" value={prop.finput.noOfQue} onChange={prop.handleInput} required />
                                                    </div>
                                                    {prop.max.map((m, index) => (
                                                        <Dialog open={prop.openm} onClose={prop.close} aria-labelledby="form-dialog-title">
                                                            <DialogTitle id="form-dialog-title">Enter Marks</DialogTitle>
                                                            <DialogContent>
                                                                <input style={{ width: "60px" }} type="number" min="0" name="noOfQue" value={m}
                                                                    onChange={(e) => { prop.change(index, e.target.value); }}
                                                                    required />
                                                            </DialogContent>
                                                            <DialogActions>
                                                                <Button onClick={prop.close} color="primary"> Cancel </Button>
                                                                <Button onClick={prop.submit} color="primary"> Set Marks </Button>
                                                            </DialogActions>
                                                        </Dialog>
                                                    ))}
                                                </div>
                                                <div style={{ margin: "20px" }}>
                                                    <p>Reviewers Per Sheet:</p>
                                                    <div style={{ marginTop: "-41px", marginLeft: "180px" }}>
                                                        <input style={{ width: "60px" }} type="number" name="reviewersPerSheet" min="0" value={prop.review} onChange={prop.handleInput} required />
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
                                                            value={prop.dead}
                                                            onChange={prop.handleInput}
                                                        />
                                                    </div>
                                                </div>
                                                <DialogActions>
                                                    <Button onClick={prop.handleClose} color="primary">Cancel </Button>
                                                    <Button type="submit" color="primary"> Add Assignment </Button>
                                                </DialogActions>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                {prop.allassg.map((p) => (
                                    <AllAssignmentCard allAssignments={p} peerAssg={prop} View={prop.TeachersView}/>
                                ))
                                }
                            </>)}
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
                                    <AssignmentCard key={p._id} data={p} ids={idArr}/>
                                ))
                                }
                            </>)}

                            
                        </div>}
                </div>
            </div>
            {<img src={bottom} alt="Image" className={styles.bottom} />}
        </div>:
        <div>
          {Role == "teacher" ? <div><TeacherPeople teach={prop} /></div> : <div>other</div>}
        </div>
    }
    </>
    )
}

export default TeacherFormfull
