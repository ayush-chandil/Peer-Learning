import React from "react";
import { useHistory } from "react-router-dom";
import "./PopUp.css";

export default function MarksPopup({ marksvalue, SetmarksValue, marks, activities}) {
    const history = useHistory();
    const SubmitAction = (e) => {
        e.preventDefault(false);
        history.push("/");
        SetmarksValue(false);
    }
    return (
        <>
            {
                marksvalue ? <div id="popup_wrapper" >
                    <div id="whole">
                        <div className="matrix">
                            <div id="up">
                                <p id="peer1"> Scoring Matrix</p>
                                <div id="popup_close" onClick={() => SetmarksValue(false)}> X </div>
                            </div>
                            <div className="box1">
                                {activities[0].review_score.map((active, k) => (
                                    <div className="main1" key={k}>
                                        <button id="ques1">Question {k + 1}</button>
                                        <button id="score12">{marks[k]}</button>
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