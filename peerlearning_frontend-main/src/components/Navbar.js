// import React, { useContext } from "react";
// import { makeStyles } from "@material-ui/core/styles";
// import AppBar from "@material-ui/core/AppBar";
// import Toolbar from "@material-ui/core/Toolbar";
// import IconButton from "@material-ui/core/IconButton";
// import Avatar from "@material-ui/core/Avatar";
// import AuthContext from "../AuthContext";
// import MenuItem from "@material-ui/core/MenuItem";
// import Menu from "@material-ui/core/Menu";
// import { GoogleLogout } from "react-google-login";
// import { Link } from "@material-ui/core";
// import pic from "../images/Help.png"; 
// import { Link as RouterLink } from "react-router-dom";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   menuButton: {
//     marginRight: theme.spacing(1),
//   },
//   title: {
//     flexGrow: 1,
//     color: "#4285F4"
//   },
//   large: {
//     width: theme.spacing(6),
//     height: theme.spacing(6),
//   },
// }));

// const Navbar = () => {
//   const classes = useStyles();
//   const { userData, setUserData } = useContext(AuthContext);
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const open = Boolean(anchorEl);

//   const handleMenu = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     // while (userData.token !== null) {
//     setUserData({
//       token: "",
//       user: {},
//       loader: 0,
//     });
//     // }
//   };
//   return (
//     <div className="container2">
//       <div className="row2">
//         <AppBar position="relative" style={{ backgroundColor: "white", color: "#4285F4" }}>
//           <Toolbar>
//             <div className="col-sm-11">
//               <Link component={RouterLink} to="/">
//                 <h2 style={{ color: "#4285F4", padding: "0px 0px 0px 60px"}}>Peer Learning</h2>
//               </Link>
//             </div>
//             {/* <div className="col-sm-8" style={{ textAlign: "right", marginTop: "10px", fontSize: "18px" }}>
//               <p>{userData.user.name}</p>
//             </div> */}
//             <div style={{display:"flex"}}>
//               <div style={{padding: "22px 10px 0px 8px"}}>
//                 <RouterLink to="/Help">
//                   <img src={pic} alt="Help"></img>
//                 </RouterLink>
//               </div>
//               <IconButton
//                 aria-label="account of current user"
//                 aria-controls="menu-appbar"
//                 aria-haspopup="true"
//                 onClick={handleMenu}
//                 color="inherit"
//               >
//                 <Avatar
//                   className={`${classes.large}`}
//                   alt="Profile Picture"
//                   src={userData.user.imageUrl}
//                 />
//               </IconButton>
//             </div>
//           </Toolbar>

//           <Menu
//             id="menu-appbar"
//             anchorEl={anchorEl}
//             anchorOrigin={{
//               vertical: "top",
//               horizontal: "right",
//             }}
//             keepMounted
//             transformOrigin={{
//               vertical: "top",
//               horizontal: "right",
//             }}
//             open={open}
//             onClose={handleClose}
//           >
//             <MenuItem onClick={handleLogout}>
//               <GoogleLogout
//                 theme={"dark"}
//                 clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
//                 buttonText="Logout"
//               />
//             </MenuItem>
//           </Menu>
//         </AppBar>
//       </div>
//     </div>
//   );
// };

// export default Navbar;

import React, { useContext } from "react";
import SideNav from "../components/Navbar/Nav";

const Navbar = () => {
return (
    <SideNav/>
);
}

export default Navbar;