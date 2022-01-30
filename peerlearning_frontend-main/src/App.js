import { useState } from "react";
import AuthContext from "./AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar/Nav";
import Dashboard from "./components/Dashboard";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Login from "./pages/Login";
import Help from "../src/Help/Help";
import Calendar from "./components/Calendar/Calendar";
import Done from "./components/Todo/Done";
import Missing from "./components/Todo/Missing";
import TodoList from "./components/Todo/TodoList";
import Student_View1 from "./components/student_View/Student_View1";
import Page1 from "./components/TeacherDashboard/Page1";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1
  },
}));

function App() {
  const [course, setCourse] = useState({});
  const [userData, setUserData] = useState({
    token: undefined,
    loader: 0,
  });

  const [open, setOpen] = useState(false);
  const [AssId, setAssId] = useState("");
  const [Cid, setCid] = useState("");
  const [message, setMessage] = useState("");
  const classes = useStyles();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const onSuccess = (res) => {
    setUserData({
      token: res.accessToken,
      user: res.profileObj,
      loader: 0,
    });
    // console.log(res);
  };

  const onFailure = (res) => {
    console.log("Login failed: res:", res);
    setUserData({
      token: undefined,
      loader: 0,
    });
  };

  function studentsView(dd, cid) {
    setAssId(dd);
    setCid(cid);
  }

  function TeachersView(dd, cid) {
    setAssId(dd);
    setCid(cid);
  }

  return (
    <div className="body">
      <AuthContext.Provider
        value={{ userData, setUserData, setMessage, setOpen }}
      >
        <Backdrop className={classes.backdrop} open={userData.loader !== 0}>
          <CircularProgress />
        </Backdrop>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="info">
            {message}
          </Alert>
        </Snackbar>

        {/* check if the user if logged in or not */}
        {userData.token ? (
          <Router>
            <Navbar setCourse={setCourse} />
            <Switch>
              <Route path="/" exact>
                <Home course={course} setCourse={setCourse} studentsView={studentsView} TeachersView={TeachersView} />
              </Route>
              <Route path="/Help" exact>
                <Help />
              </Route>
              <Route path="/Assigned" exact>
                <TodoList />
              </Route>
              <Route path="/Missing" exact>
                <Missing />
              </Route>
              <Route path="/Done" exact>
                <Done />
              </Route>
              <Route path="/Calendar" exact>
                <Calendar />
              </Route>
              <Route path="/Sview1/:AssId/:Cid">
                <Student_View1 />
              </Route>
              <Route path="/TeacherView1/:AssId/:Cid" exact>
                <Page1 />
              </Route>
              {/* <Route path="/home/:course_id">
                <Home />
              </Route> */}
              <Route path="/dashboard/:course_id/:id">
                <Dashboard />
              </Route>
            </Switch>
          </Router>
        ) : (
          //if not logged in
          <Login onSuccess={onSuccess} onFailure={onFailure} />
        )}
      </AuthContext.Provider>
    </div>
  );
}

export default App;
