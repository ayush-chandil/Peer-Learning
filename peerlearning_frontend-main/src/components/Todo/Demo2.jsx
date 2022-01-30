import React from 'react'
import '../Todo/todostyle.css';
import Assignment from '../Todo/images/Assignment.svg';

const Demo=()=> {
    return (
        <>
       
          <div className="assign">
          <p id="lab">Lab 9</p>
          <p id="course">CS 303(Computer Networks)</p>
          {/* <hr id="line"></hr> */}
          <img src={Assignment} id="Assignment"/>
      </div>
        <p id="time2">Turned In</p>

        <div className="assign1">
          <p id="lab">Lab 9</p>
          <p id="course">CS 303(Computer Networks)</p>
          {/* <hr id="line"></hr> */}
          <img src={Assignment} id="Assignment"/> 
          
      </div>
      <p id="time2">Turned In</p>

        <div className="assign2">
          <p id="lab">Lab 9</p>
          <p id="course">CS 303(Computer Networks)</p>
          {/* <hr id="line"></hr> */}
          <img src={Assignment} id="Assignment"/> 
          
      </div>
    
      <p id="time2">Turned In</p>
         
       
    
        </>
    )
}

export default Demo
