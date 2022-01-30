import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./PopUp.css";

export default function Self({ wrapperValue, SetWrapperValue, self, marks, setSelf }) {
    const history = useHistory();
    const SubmitAction = (e) => {
        e.preventDefault(false);
        history.push("/");
        SetWrapperValue(false);
    }

    const handleSelfScoreChange = (k, e) => {
        let { value, min, max } = e.target;
        value = Math.max(Number(min), Math.min(Number(max), Number(value)));
        const s = self;
        s.review_score[k] = value;
        setSelf({ ...self });
    };

    return (
        <>
            {
                wrapperValue ? <div id="popup_wrapper" >
                    <div id="whole">
                        <div className="matrix">
                            <div id="up">
                                <p id="peer1"> Self Evaluation</p>
                                <div id="popup_close" onClick={() => SetWrapperValue(false)}> X </div>
                            </div>
                            <div className="box1">
                                {self.review_score.map((active, k) => (
                                    <div className="main1" key={k}>
                                        <button id="ques">Question {k + 1}</button>
                                        <input
                                            id="score"
                                            type="number"
                                            value={self.review_score[k]}
                                            min={0}
                                            max={marks[k]}
                                            onChange={(e) => handleSelfScoreChange(k, e)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div> : null
            }

        </>
    )
}