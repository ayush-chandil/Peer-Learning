import React from "react";
import { useHistory } from "react-router-dom";
import "./PopUp.css";

export default function Account({ wrapperValue, SetWrapperValue, marks, activities, setActivities, i }) {
    const history = useHistory();
    const SubmitAction = (e) => {
        e.preventDefault(false);
        history.push("/");
        SetWrapperValue(false);
    }

    const handleScoreChange = (i, k, e) => {
        let { value, min, max } = e.target;
        value = Math.max(Number(min), Math.min(Number(max), Number(value)));
        const ac = activities;
        ac[i].review_score[k] = value;
        setActivities([...ac]);
    };

    return (
        <>
            {
                wrapperValue ? <div id="popup_wrapper" >
                    <div id="whole">
                        <div className="matrix">
                            <div id="up">
                                <p id="peer1"> Peer Evaluation</p>
                                <div id="popup_close" onClick={() => SetWrapperValue(false)}> X </div>
                            </div>
                            <div className="box1">
                                {activities[0].review_score.map((active, k) => (
                                    <div className="main1" key={k}>
                                        <button id="ques">Question {k + 1}</button>
                                        <input
                                            id="score"
                                            type="number"
                                            value={activities[i].review_score[k]}
                                            min={0}
                                            max={marks[k]}
                                            onChange={(e) => handleScoreChange(i, k, e)} />
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