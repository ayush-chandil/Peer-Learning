import React , {useState} from 'react';
import styles from './Form.module.css';

const Form1 = () => {
  const [peerAssignments, setPeerAssignments] = useState([]);
    return (
        <div>
           <form id="peers" className={styles.form}>
            <input type="text" placeholder="Username"></input>
            <input type="text" placeholder="Password"></input>
            <button class="btn">Peers</button>
          </form> 
        </div>
    )
}
export default Form1
