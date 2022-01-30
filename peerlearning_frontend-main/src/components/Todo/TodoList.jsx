import React from 'react'
import { NavLink } from 'react-router-dom';
import '../Todo/todostyle.css';
import Assigned from './Assigned';


const TodoList=()=>{
    return (
    <>
    <div className="list">
        <NavLink activeClassName='menu_active' className="nav-link anchorlink" to="/Assigned">Assigned</NavLink>
        <NavLink activeClassName='menu_active' className="nav-link anchorlink" to="/Missing">Missing</NavLink>
        <NavLink activeClassName='menu_active' className="nav-link anchorlink" to="/Done">Done</NavLink>
    </div>
    <Assigned/> 
    </>
    )
}
export default TodoList;