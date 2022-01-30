import React from 'react';
import { useContext, useEffect, useState } from "react";
import "../Calendar/Calendar.css";
import Nav from '../Navbar/Nav';
import AuthContext from "../../AuthContext";
import { G_API, API } from "../../config";
import bottom from '../../images/bottom.png';

export default function Calendar({ setCourse }) {
    const [courses, setCourses] = useState([]);
    const [Assign, setAssign] = useState([]);
    const [dated, setDated] = useState([]);
    let [u, Setu] = useState(0);
    const { userData, setUserData, setOpen, setMessage } = useContext(
        AuthContext
    );

    let arr = [];
    let arr1 = [];
    let dates = [];
    let date_length;

    useEffect(() => {
        if (userData.token) {
            setUserData((u) => ({ ...u, loader: u.loader + 1 }));
            const data = fetch(`${G_API}/courses?courseStates=ACTIVE`, {  // fetch active courses for a user and store it inside courses 
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userData.token}`,
                },
            })
                .then((res) => res.json())
                .then((res) => {
                    setUserData((u) => ({ ...u, loader: u.loader - 1 }));
                    setCourses(res.courses);
                    let len = res.courses.length;
                    for (let qal = 0; qal < len; qal++) {
                        fetch(`${API}/api/assignment?course_id=${res.courses[qal].id}`, { //add the assignments using backend assignment module (the field of status is added by default)
                            method: "GET",
                        })
                            .then((r) => r.json())
                            .then((r) => {
                                setAssign((prev)=>{
                                    //console.log(prev?.length,r?.length)
                                    return [...prev,...r]})
                            });
                    }
                });
        }
    }, [userData.token], [courses.id]);
    console.log(Assign);
    // console.log(Assign.length);

    function chutney(){
        dates = [];
        for (let x = 0; x < Assign.length; x++) {
            const string4 = new String(Assign[x].reviewer_deadline);
            // console.log(string4.substring(0,10));
            var momo = (string4.substring(0, 4)).concat(string4.substring(5, 7));
            var momo1 = momo.concat(string4.substring(8, 10))
            let momo2 = parseInt(momo1);
            dates.push(momo2);
        }
        setDated(dates)
        console.log(dated);
    }
    useEffect(() => {
        chutney();
    }, [Assign])

    // Calendar Logic
    var getDaysInMonth = function (month, year) {
        return new Date(year, month, 0).getDate();
    };
    //console.log(getDaysInMonth(2, 2013));

    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // x=0 is sunday, x=1 is monday and so on..
    const Find_date = (x, l, u) => {
        let s, da, dy, m, y, b, c, e;
        let arr = forw(u);
        y = arr[0];
        m = arr[1];
        da = arr[2];
        dy = arr[3];
        s = da - dy + x;
        if (s > 0) {
            if (s <= getDaysInMonth(m - 1, y)) {
                b = s;
                c = month[m];
                e = y;
            }
            else {
                b = s - getDaysInMonth(m - 1, y);
                if (m === 11) {
                    c = month[0];
                    e = y + 1;
                }
                else {
                    c = month[m + 1];
                    e = y;
                }
            }
        }
        else {
            b = s + getDaysInMonth(m, y);
            if (m === 0) {
                c = month[11];
                e = y - 1;
            }
            else {
                c = month[m - 1];
                e = y;
            }
        }
        if (l === 1)
            return (b);
        else if (l === 2)
            return (c);
        else
            return (e);
    }

    const forw = (u) => {
        var arr = [];
        var date = new Date();
        let k = 1;
        if (u > 0) {
            k = 1;
        }
        else {
            k = -1;
            u = u * -1;
        }
        for (var i = 0; i < 7 * u; i++) {
            date.setDate(date.getDate() + k);
        }
        arr[0] = date.getFullYear();
        arr[1] = date.getMonth();
        arr[2] = date.getDate();
        arr[3] = date.getDay();
        return arr;
    }
    var date = new Date();
    let dd = date.getDay();

    //complete**********************************************************

    // let dint;
    const darr = (l, u) => {
        let checker;
        for (let i = 0; i < month.length; i++) {
            if (Find_date(l, 2, u) == month[i]) {
                checker = i + 1;
            }
        }
        let dint = Find_date(l, 1, u) + checker * 100 + Find_date(l, 3, u) * 10000;
        return dint;
    }

    const comp = (l, u) => {
        let val = darr(l, u);
        var rahul = [];
        // return dated.filter(ele=>ele===val).map(ele=>dated.indexOf(ele))
        for (let temp = 0; temp < dated.length; temp++) {
            if (val === dated[temp]) {
                rahul.push(temp);
            }
        }
        return rahul;
    }
    // console.log(comp(0,u));
    // console.log(comp(1,u));
    // console.log(comp(6,u));
    console.log(comp(2,0));

    function truncateString(str) {
        return str.length >= 20 ? str.substring(0, 17) + "..." : str;
    }

    function timer(time){
        var ap = "AM";
        var dt = new Date(time);
        var both = dt.toLocaleString();
        if(both.substring(16,19) > 12)
        {
            ap = "PM";
        }
        console.log(both);
        return both.substring(12,16) + " " + both.substring(20,22);
    }
    return (
        <>
            <div className="container week_container">
                <div className="week_title mt-5">
                    <i class="fas fa-less-than prev" onClick={() => { Setu(u - 1) }}></i>
                    <span className="top_dates"> {Find_date(0, 2, u)}&nbsp;{Find_date(0, 1, u)}<span className="title_line">-</span>{Find_date(6, 2, u)}&nbsp;{Find_date(6, 1, u)},&nbsp;{Find_date(6, 3, u)} </span>
                    <i className="fas fa-greater-than next" onClick={() => { Setu(u + 1) }}></i>
                </div>
                <div className="main_box mt-3">
                    <div className="week_div">
                        {
                            (u === 0 && dd === 0) ?
                                <p className="curr_week">Sun</p>
                                : <p className="week_name">Sun</p>
                        }
                        {
                            (u === 0 && dd === 0) ?
                                <p className="curr_date">{Find_date(0, 1, u)}</p>
                                : <p className="week_date">{Find_date(0, 1, u)}</p>

                        }
                        {comp(0,u).map((p) => (
                            <div className="Assig">
                                <span id="assignment_title">{truncateString(Assign[p].assignment_title)}</span><br/>
                                <span id="reviewer_deadline">{timer(Assign[p].reviewer_deadline)}</span>
                                <p className="peer_learning_title">{truncateString(Assign[p].course_name)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="ver_line"></div>
                    <div className="week_div">
                        {
                            (u === 0 && dd === 1) ?
                                <p className="curr_week">Mon</p>
                                : <p className="week_name">Mon</p>
                        }
                        {
                            (u === 0 && dd === 1) ?
                                <p className="curr_date">{Find_date(1, 1, u)}</p>
                                : <p className="week_date">{Find_date(1, 1, u)}</p>
                        }
                        {comp(1,u).map((p) => (
                            <div className="Assig">
                                <span id="assignment_title">{truncateString(Assign[p].assignment_title)}</span><br/>
                                <span id="reviewer_deadline">{timer(Assign[p].reviewer_deadline)}</span>
                                <p className="peer_learning_title">{truncateString(Assign[p].course_name)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="ver_line"></div>
                    <div className="week_div">
                        {
                            (u === 0 && dd === 2) ?
                                <p className="curr_week">Tue</p>
                                : <p className="week_name">Tue</p>
                        }
                        {
                            (u === 0 && dd === 2) ?
                                <p className="curr_date">{Find_date(2, 1, u)}</p>
                                : <p className="week_date">{Find_date(2, 1, u)}</p>
                        }
                        {comp(2,u).map((p) => (
                            <div className="Assig">
                                <span id="assignment_title">{truncateString(Assign[p].assignment_title)}</span><br/>
                                <span id="reviewer_deadline">{timer(Assign[p].reviewer_deadline)}</span>
                                <p className="peer_learning_title">{truncateString(Assign[p].course_name)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="ver_line"></div>
                    <div className="week_div">
                        {
                            (u === 0 && dd === 3) ?
                                <p className="curr_week">Wed</p>
                                : <p className="week_name">Wed</p>
                        }
                        {
                            (u === 0 && dd === 3) ?
                                <p className="curr_date">{Find_date(3, 1, u)}</p>
                                : <p className="week_date">{Find_date(3, 1, u)}</p>

                        }
                        {comp(3,u).map((p) => (
                            <div className="Assig">
                                <span id="assignment_title">{truncateString(Assign[p].assignment_title)}</span><br/>
                                <span id="reviewer_deadline">{timer(Assign[p].reviewer_deadline)}</span>
                                <p className="peer_learning_title">{truncateString(Assign[p].course_name)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="ver_line"></div>
                    <div className="week_div">
                        {
                            (u === 0 && dd === 4) ?
                                <p className="curr_week">Thu</p>
                                : <p className="week_name">Thu</p>
                        }
                        {
                            (u === 0 && dd === 4) ?
                                <p className="curr_date">{Find_date(4, 1, u)}</p>
                                : <p className="week_date">{Find_date(4, 1, u)}</p>

                        }
                        {comp(4,u).map((p) => (
                            <div className="Assig">
                                <span id="assignment_title">{truncateString(Assign[p].assignment_title)}</span><br/>
                                <span id="reviewer_deadline">{timer(Assign[p].reviewer_deadline)}</span>
                                <p className="peer_learning_title">{truncateString(Assign[p].course_name)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="ver_line"></div>
                    <div className="week_div">
                        {
                            (u === 0 && dd === 5) ?
                                <p className="curr_week">Fri</p>
                                : <p className="week_name">Fri</p>
                        }
                        {
                            (u === 0 && dd === 5) ?
                                <p className="curr_date">{Find_date(5, 1, u)}</p>
                                : <p className="week_date">{Find_date(5, 1, u)}</p>
                        }
                        {comp(5,u).map((p) => (
                            <div className="Assig">
                                <span id="assignment_title">{truncateString(Assign[p].assignment_title)}</span><br/>
                                <span id="reviewer_deadline">{timer(Assign[p].reviewer_deadline)}</span>
                                <p className="peer_learning_title">{truncateString(Assign[p].course_name)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="ver_line"></div>
                    <div className="week_div">
                        {
                            (u === 0 && dd === 6) ?
                                <p className="curr_week">Sat</p>
                                : <p className="week_name">Sat</p>
                        }
                        {
                            (u === 0 && dd === 6) ?
                                <p className="curr_date">{Find_date(6, 1, u)}</p>
                                : <p className="week_date">{Find_date(6, 1, u)}</p>
                        }
                        {comp(6,u).map((p) => (
                            <div className="Assig">
                                <span id="assignment_title">{truncateString(Assign[p].assignment_title)}</span><br/>
                                <span id="reviewer_deadline">{timer(Assign[p].reviewer_deadline)}</span>
                                <p className="peer_learning_title">{truncateString(Assign[p].course_name)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {<img src={bottom} alt="Image" className="bottom" />}
        </>
    )
}