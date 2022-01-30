import React from 'react'
import styles from './Form.module.css'

const form2 = () => {
    return (
        <div>
            <form id="all"  className={styles.form}>
            <input type="text" placeholder="Name"></input>
            <input type="e-mail" placeholder="E-mail"></input>
            <input type="number" placeholder="Contact no."></input>
            <button class="btn">All</button>
          </form>
        </div>
    )
}

export default form2
