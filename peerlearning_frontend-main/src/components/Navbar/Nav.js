import React, { useContext, useEffect, useState } from 'react';
import * as AiIcons from 'react-icons/ai';
import { ReactComponent as Hamburger } from '../Navbar/Images/hamburger.svg';
import { ReactComponent as HelpIcon } from '../Navbar/Images/Help.svg';
import { ReactComponent as LogoutIcon } from '../Navbar/Images/log-out.svg';
import { ReactComponent as CalendarIcon } from '../Navbar/Images/Calendar.svg';
import { ReactComponent as QueryIcon } from '../Navbar/Images/Query.svg';
import { ReactComponent as TodoIcon } from '../Navbar/Images/To-do.svg';
import { ReactComponent as ReviewIcon } from '../Navbar/Images/Review.svg';
import { Link } from 'react-router-dom';
import { Link as RouterLink } from "react-router-dom";
import {useHistory} from "react-router";
import './Nav.css';
import { GoogleLogout } from "react-google-login";
import MenuItem from "@material-ui/core/MenuItem";
import { IconContext } from 'react-icons';
import AuthContext from '../../AuthContext';
import {G_API} from "../../config";

function Nav({setCourse}) {
const history = useHistory();
const { userData, setUserData, setOpen, setMessage } = useContext(
  AuthContext
);

const [sidebar, setSidebar] = useState(false);
const showSidebar = () => setSidebar(!sidebar);
const [Value, setValue] = useState(true);
const [courses, setCourses] = useState([]);

useEffect(() => {
  if (userData.token) {
    setUserData((u) => ({ ...u, loader: u.loader + 1 }));
    fetch(`${G_API}/courses?courseStates=ACTIVE`, {  // fetch active courses for a user and store it inside courses 
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setUserData((u) => ({ ...u, loader: u.loader - 1 }));
        setCourses(res.courses);
        // len = res.courses.length;
        // console.log(res.courses[0].name);

      });

  }

}, [userData.token]);
// let GAN = userData.user.name;

const truncate = (str) => {
if (str.length>25) {
  let substr = str.substring(0,25);
  return substr + "...";
}
else
    return str;
}

const handleLogout = () => {
    setUserData({
      token: "",
      user: {},
      loader: 0,
    });
  }
  // console.log(Value);

return (
  <>
    <IconContext.Provider value={{ color: '#fff' }}>

      <div className='navbar container-fluid'>

        <Link to='#' className='menu-bars'>
          <Hamburger onClick={showSidebar} />
        </Link>
        <Link onClick={()=>{
          setCourse({})
          history.push("/")
        }}>
        <h4 className="navbar-title-name">Peer Learning</h4>
        </Link>
        
        {/* {
          Title ? <h4 className="navbar-title-name">Peer Learning</h4>
          :<h4 className="navbar-title-name">Peer Learning</h4>
        } */}


          {/* <p className="user_name">{userData.user.name}</p> */}
          <div className="navbar-right-side-icon">
          <Link to="/Help" className="help_page_icon" data-toggle="tooltip" data-placement="botom" title="Help"><HelpIcon/></Link>
          <Link  data-toggle="tooltip" data-placement="botom" title={userData.user.name}>
          <img className="profile_user_name" src={userData.user.imageUrl} onClick={() => setValue(!Value)}></img>
          </Link>

          <MenuItem className={Value ? "nav_hide" : "nav_show"} onClick={handleLogout}>
          <GoogleLogout
            theme={"dark"}
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Logout"
          />
        </MenuItem>
          </div>
      </div>

      <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
        <ul className='nav-menu-items' onClick={showSidebar}>
          <li className='navbar-toggle'>
            <Link to='#' className='menu-closebars'>
              <AiIcons.AiOutlineClose  className="closebars"/>
            </Link>
          </li>

          <li className="top-sidebar-icon">
          <CalendarIcon/>
          <RouterLink to="/Calendar">
          <p className="top-li-elements">Calendar</p>
          </RouterLink>
          </li>

          <li className="top-sidebar-icon">
          <TodoIcon/>
          <RouterLink to="/Assigned">
          <p className="top-li-elements">To-do</p>
          </RouterLink>
          </li>
          
          <li className="top-sidebar-icon">
          <HelpIcon/>
          <RouterLink to="/Help">
          <p className="top-li-elements">Help</p>
          </RouterLink>
          </li>

          <li className="top-sidebar-icon">
          <QueryIcon/>
          <p className="top-li-elements">Query</p>
          </li>
        
          <hr className="hr_line"></hr>
          
          {courses.map((item, index) => {
            return (
              <li key={index} onClick={() => {
                setCourse(item)
                history.push("/")
              }}>
                <div className="list-elements">
                <p className="first_letter">{item.name.charAt(0)}</p>
                <Link className="sidebar_name" to={item.path}>
                  <span className="sp1">{truncate(item.name)}</span>
                </Link>
                </div>
              
              </li>
            );
          })}


        </ul>
      </nav>

    </IconContext.Provider>
  </>
);
}

export default Nav;