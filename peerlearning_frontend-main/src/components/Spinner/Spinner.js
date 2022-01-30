import React from "react";
import styles from "./Spinner.module.css";
import Backdrop from "./Backdrop";
function App() {
  return (
    <div>
      <Backdrop show={true} />
      <div class={styles["sk-folding-cube"]}>
      <div className={styles.loader}></div>
      </div>
    </div>
  );
}

export default App;
