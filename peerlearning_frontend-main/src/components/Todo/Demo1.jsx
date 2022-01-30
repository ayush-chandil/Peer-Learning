import React from 'react'
import Assignment from '../Todo/images/Assignment.svg';
import '../Todo/todostyle.css';
const Demo=()=> {
    return (
        <>
          <div className="assign">
          <p id="lab">Lab 9</p>
          
          <p id="course">CS 303(Computer Networks)</p>
          {/* <hr id="line"></hr> */}
          <img src={Assignment} id="Assignment"/> 
          
      </div>
        <p id="time1">Today 6:00pm</p>

        <div className="assign1">
          <p id="lab">Lab 9</p>
          
          <p id="course">CS 303(Computer Networks)</p>
          {/* <hr id="line"></hr> */}
          <img src={Assignment} id="Assignment"/> 
          
      </div>
        <p id="time1">Yesterday 6:00pm</p>

        <div className="assign2">
          <p id="lab">Lab 9</p>
         
          <p id="course">CS 303(Computer Networks)</p>
          {/* <hr id="line"></hr> */}
          <img src={Assignment} id="Assignment"/> 
          
      </div>
        <p id="time1">Yesterday 3:00pm</p>
  
        </>
    )
}

export default Demo
