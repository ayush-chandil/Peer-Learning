import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../AuthContext";
import { G_API, API } from "../../config";
import { useHistory } from "react-router-dom";
import styles from "./FinalisePop.module.css";

export default function SelfFinalisePopup({ selfFinalise, SetselfFinalise, self, setSelf }) {
    const history = useHistory();
    const { userData, setUserData, setOpen, setMessage } = useContext(
        AuthContext
    );
    const SubmitAction = (e) => {
        e.preventDefault(false);
        history.push("/");
        SetselfFinalise(false);
    }

    const handleit = (e) => {
        const s = self;
        s.reviewer_comment[0] = "yes";
        setSelf({ ...self });
    };

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
                selfFinalise ? <div id={styles.popup_wrapper} >
                    <div id={styles.whole}>
                        <div className={styles.finalize}>
                            <div id={styles.up}>
                                <p id={styles.submit}>Finalize Score ? </p>
                                <div id={styles.popup_close} onClick={() => SetselfFinalise(false)}> X </div>
                            </div>
                            <p id={styles.reviews}>Once Finalized, you can't make any further changes to your Scores</p>
                            <div className={styles.option}>
                                <button id={styles.btn} onClick={(e) => { SetselfFinalise(false); handleit(e); submitReview(self) }}>Yes</button>
                                <button id={styles.btn1} onClick={() => SetselfFinalise(false)}>No</button>
                            </div>
                        </div>
                    </div>
                </div> : null
            }

        </>
    )
}