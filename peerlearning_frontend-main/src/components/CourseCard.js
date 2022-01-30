import React, { useContext, useState } from "react";
import AuthContext from "../AuthContext";
import { G_API, API } from "../config";
import '../index.css';
import dash from '../images/dashboard.png';
import room from '../images/google-classroom.png';

function truncateString(str) {
  return str.length >= 18 ? str.substring(0, 17) + "..." : str;
}

function truncateString1(str) {
  return str.length >= 22 ? str.substring(0, 18) + "..." : str;
}

const CourseCard = ({ data,setCourse,image}) => {
  const [TeachersName,setTeachersName] = useState([]);
  const [Photo, setPhoto] = useState([]);
  const { userData } = useContext(AuthContext);
  fetch(`${G_API}/courses/${data.id}/teachers`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${userData.token}`,
    },
  })
  .then((res) => res.json())
  .then((res) => {
    var len = res.teachers.length;
    // console.log(res);
    setPhoto("https:"+res.teachers[len-1].profile.photoUrl);
    setTeachersName(res.teachers[len-1].profile.name.fullName);
  });

  return(
    <>
    <div className="submain_courseCard" onClick={() => setCourse(data)}>
      <div className="classCard__upper" style={{backgroundImage: `url(/images/${image})`}}>
        <div className="name_courseCard">{truncateString(data.name)}</div>
        <div className="section_courseCard">{truncateString1(TeachersName)}</div>
        <img className="classCard__creatorPhoto" src={Photo} alt="Image"></img>
      </div>
      <div className="classCard__middle"></div>
      <div className="foot">
        <button className="btm2"><img src={dash} alt="dashboard"/> Dashboard</button>
        <a href={data.alternateLink}>
        <button className="btm2"><img src={room} alt="dashboard"/> Classroom</button>
        </a>
      </div>
    </div>
    </>
  );
};

export default CourseCard;