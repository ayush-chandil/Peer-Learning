import React, { useContext } from "react";
import { GoogleLogin } from "react-google-login";
import BgImg from "../images/Home.png";
import left from "../images/left.png";
import right from "../images/right.png";
import AuthContext from "../AuthContext";

function Login(props) {
    const { userData, setUserData } =
        useContext(AuthContext);

    return (
        // CSS from Style.css
        <div id="login">
            <div className="left">
                <img src={left} alt="Left Wave" />
            </div>
            <div className="container1">
                <div className="row1">
                    <div className="col-2">
                        <img src={BgImg} alt="Peer Learning" />
                    </div>
                    <div className="col-2">
                        <h1>Peer Learning Platform</h1>
                        <h3>A platform specifically designed as an addition to Google Classroom for students to gain the best out of online education, look at solutions not just from their but also from the perspectives of their peers.</h3>
                        <h3>A platform that not only promotes education but also instills moral integrity within it’s community.</h3>
                        <div className="SignInButton1">
                            <GoogleLogin
                                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                                buttonText="Sign in with Google"
                                onSuccess={props.onSuccess}
                                onFailure={props.onFailure}
                                cookiePolicy={"single_host_origin"}
                                // theme={""}
                                onRequest={() => setUserData({ ...userData, loader: 1 })}
                                isSignedIn={true}
                                scope="email profile https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.coursework.students.readonly https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.announcements"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="right">
                <img src={right} alt="Right Wave" />
            </div>
        </div>
    );
}

export default Login;
