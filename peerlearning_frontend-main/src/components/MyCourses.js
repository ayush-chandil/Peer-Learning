import React from 'react'
import { useContext, useEffect, useState } from "react";
import AuthContext from "../AuthContext";
import { G_API, API } from "../config";
import CourseCard from "./CourseCard";

function MyCourses() {

    const { userData, setUserData, setOpen, setMessage } = useContext(
        AuthContext
    );
    const [courses, setCourses] = useState([]); //for storing active courses for logged in user
    const [course, setCourse] = useState({});

    console.log(course);
    useEffect(() => {
        if (userData.token) {
            // console.log("User data before fetching active courses", userData);
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
                    console.log("res:", res);
                    console.log("Set Courses(res.courses): ", res.courses);
                    console.log("User data after this: ", userData);
                });
        }
    }, [userData.token]);

    return (
        <div className="main">
            <p className="courses-text">My Courses</p>
            {courses.map((c) => (
                <CourseCard data={c} setCourse={setCourse} key={c.id} />
            ))}
        </div>
    )
}

export default MyCourses;