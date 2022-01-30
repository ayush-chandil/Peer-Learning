import React,{useState} from 'react';
import "./Help.css";
import arrow from "./downarrow.svg";
import Nav from '../components/Navbar/Nav';
import bottom from "../images/bottom.png";

const Help=()=>{
const [Value, setValue] = useState(true);
const [Value2, setValue2] = useState(true);
const [Value3, setValue3] = useState(true);
const [Value4, setValue4] = useState(true);
return(
<>
  <div className="help">Help</div>
  <div className="help1">
    Can’t find your question below, reach out to us via <a href="mailto:abc@gmail.com" target="_blank">Email</a>
  </div>
  <div className="box">
    <div className={Value ? "aa" : "bb"}>   
      <p id="question"> How to use the Platform? <img src={arrow} id="arrow" onClick={() => setValue(!Value)} /> </p>
      <div className={Value ? "hide" : "show"}>
        <video width="716" height="350" controls poster="https://via.placeholder.com/716x350">
        <source src="https://media.geeksforgeeks.org/wp-content/uploads/20200409094356/Placement100-_-GeeksforGeeks2.mp4" 
        type="video/mp4" /> </video>
      </div>  
    </div> 
    <div className={Value2 ? "aa" : "bb"}>
      <p id="question">What is Consistency Score? <img src={arrow} id="arrow" onClick={() => setValue2(!Value2)}/></p>
      <div className={Value2 ? "hide" : "show"} id="answer">
      The extent to which the scores on a measure are consistent across the review process. When the peer grade of the student is close to the absolute grade or mean of all the grades, the consistency score will be high, and vice versa. The Consistency Score is a Degree of Honesty and is not based on any absolute review that we can compare to other reviews and award them some score.
      </div>
    </div>
    <div className={Value3 ? "aa" : "bb"}>
      <p id="question">How does the peer learning algorithm work? <img src={arrow} id="arrow"  onClick={() => setValue3(!Value3)}/></p>
      <div className={Value3 ? "hide" : "show"} id="answer">
      The peer learning platform is a Google-classroom influenced platform where the teacher of a particular course can convert a normal assignment to a peer learning assignment and then the students enrolled in the course can visit the platform to review the assignments and give them a mark accordingly set by the teacher.Then the reviewers as well as the teacher give marks to that particular assignment of the student. And thus, the consistency score is calculated and the peer review is completed.
      </div>
    </div> 
    <div className={Value4 ? "aa" : "bb"}>
      <p id="question">How to raise a Query? <img src={arrow} id="arrow" onClick={() => setValue4(!Value4)}/></p>
      <div className={Value4 ? "hide" : "show"} id="answer">
      Students can use the Query button on the Home page to raise queries related to inconsistent consistency scores, doubts related to assignments or regarding abnormal marking by a peer, etc. After raising the query, there is a Chatroom where the student can discuss his/her issue with the faculty in charge. Once the doubt is resolved, the student gets the option to terminate the query.
      </div>
    </div>
    </div>
    <img src={bottom} alt="Image" className="bott"/>
</>
)
};
export default Help;