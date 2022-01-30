import React from 'react';
import styles from "./PeerReviews.module.css";

function PeerReviews({matrix,setmatrix}) {
   
    return (
        <>
            <div className={styles.name}>
                <p id={styles.submit}> Submit Peer Reviews? </p>
                <p id={styles.reviews}>Once submitted, you can't make any further  <br></br> changes to the reviews  </p>
                <div className={styles.option}>
                    <button id={styles.btn}>Yes</button>
                    <button id={styles.btn1}>No</button>
                </div>
            </div>


            <div className={styles.matrix}>
                <p id={styles.peer}> Peer Evaluation</p>
                <div className={styles.box}>
                    <div className={styles.main}>
                        <button id={styles.ques}>Question 1</button>
                        <input type="number" placeholder="Add Score" id={styles.score}></input>
                    </div>
                    <div className={styles.main}>
                        <button id={styles.ques}>Question 2</button>
                        <input type="number" placeholder="Add Score" id={styles.score}></input>
                    </div>
                    <div className={styles.main}>
                        <button id={styles.ques}>Question 3</button>
                        <input type="number" placeholder="Add Score" id={styles.score}></input>
                    </div>
                    <div className={styles.main}>
                        <button id={styles.ques}>Question 4</button>
                        <input type="number" placeholder="Add Score" id={styles.score}></input>
                    </div>
                </div>
            </div>


            <div className={styles.finalize}>
                <p id={styles.submit}>Finalize Score ? </p>
                <p id={styles.reviews}>Once Finalized, you can’t make any further changes <br></br> to the Scores for Peer - 1</p>
                <div className={styles.option}>
                    <button id={styles.btn}>Yes</button>
                    <button id={styles.btn1}>No</button>
                </div>
            </div>


            <div className={styles.name}>
                <p id={styles.submit}> Stop Peer Learning? </p>
                <p id={styles.reviews}>If you stop Peer Learning, before the declared <br></br> Deadline, some Students might miss out   </p>
                <div className={styles.option}>
                    <button id={styles.btn}>Yes</button>
                    <button id={styles.btn1}>No</button>
                </div>
            </div>
        </>
    )
}

export default PeerReviews
