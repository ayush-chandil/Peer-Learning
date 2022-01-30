import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../AuthContext";
import { G_API, API } from "../../config";
import { useHistory } from "react-router-dom";
import styles from "./FinalisePop.module.css";

export default function Submitpop({ Sub, SetSub, self, setSelf, activities, setActivities}) {
    console.log(activities);
    const history = useHistory();
    const { userData, setUserData, setOpen, setMessage } = useContext(
        AuthContext
    );
    const SubmitAction = (e) => {
        e.preventDefault(false);
        history.push("/");
        SetSub(false);
    }

    const handleit = (e) => {
        const ac = activities;
        for(var i=0;i<ac.length;i++){
            ac[i].reviewer_comment[0] = 'yes';
        }
        setActivities([...ac]);
    };

    const handleself = (e) => {
        const s = self;
        s.reviewer_comment[0] = "yes";
        setSelf({ ...self });
    };

    function loopcall(){
        for(var i=0;i<activities.length;i++){
            return submitReview(activities[i])
        }
    }

    const submitReview = (row) => {
        setUserData((u) => ({ ...u, loader: u.loader + 1 }));
        fetch(`${API}/api/reviewassignment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                peer_activity_id: row._id,
                review_score: row.review_score,
                reviewer_comment: row.reviewer_comment,
            }),
        })
            .then((res) => res.json())
            .then(
                (res) => {
                    setOpen(true);
                    setMessage("Successfully saved review");
                    setUserData((u) => ({ ...u, loader: u.loader - 1 }));
                },
                (err) => {
                    setOpen(true);
                    setMessage("Some thing went wrong while saving review");
                    setUserData((u) => ({ ...u, loader: u.loader - 1 }));
                }
            );
    };

    return (
        <>
            {
                Sub ? <div id={styles.popup_wrapper} >
                    <div id={styles.whole}>
                        <div className={styles.names}>
                            <div id={styles.up}>
                                <p id={styles.submit}>Submit Peer Reviews? </p>
                                <div id={styles.popup_closed} onClick={() => SetSub(false)}> X </div>
                            </div>
                            <p id={styles.reviews}>Once submitted, you can't make any further changes to the reviews  </p>
                            <div className={styles.option}>
                                <button id={styles.btn} onClick={(e) => { SetSub(false); submitReview(self); handleself(e); handleit(e); loopcall(); }}>Yes</button>
                                <button id={styles.btn1} onClick={() => SetSub(false)}>No</button>
                            </div>
                        </div>
                    </div>
                </div> : null
            }

        </>
    )
}