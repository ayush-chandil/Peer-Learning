import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import '../index.css'
import asimg from '../images/Assignment.png';
import more from '../images/more.png';

const AssignmentCard = ({ data,ids}) => {
  const [opt, setopt] = useState(false);
  // console.log(data);
  const history = useHistory();
  var reviewDeadline = "";
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      color: "#4285F4"
    },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
  }));

  const classes = useStyles();
  const truncate = (str) => {
    if (str) {
      return str.length > 75 ? str.substring(0, 75) + "..." : str;
    }
  }
  var day = '-';
  var month = '-';
  var year = '-';
  if(data.creationTime)
  {
    day = data.creationTime.substring(8,10);
    month = data.creationTime.substring(5, 7);
    year = data.creationTime.substring(0, 4);
  }
  const f1 = () => {
    setopt(true)
  }
  return (
  <>
    {ids.map((e)=>(
      e === data.assignment_id ? 
    <div className="submain" onClick={() => history.push(`/dashboard/${data.course_id}/${data._id}`)}>
      <div className="left-part">
        <div className="Image"><img src={asimg} alt="Assignment-Image"/></div>
        <div>
          <div className="section">{data.assignment_title}</div>
          <div className="date">{day}/{month}/{year}</div>
        </div>
      </div>
      <div className="MoreImage"><img src={more} onClick={f1} alt="More-Options"/>
        <div className="options">
          <a href={data.alternateLink}>View in Classroom <i class="fa fa-external-link" aria-hidden="true"></i></a>
        </div>
      </div>
    </div>
    :
    null
    ))}
  </>
  );
};

export default AssignmentCard;