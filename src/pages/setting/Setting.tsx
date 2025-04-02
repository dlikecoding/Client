import { CloseIcon } from "../../components/svgIcons";
import styles from "./Setting.module.css";

const Setting = () => {
  console.log("Setting");

  return (
    <>
      <>
        <h1>Setting</h1>
        {/* <div class={styles.barChart}>
          <canvas id="barChart" data-chartjs={JSON.stringify({})}></canvas>
        </div> */}

        <div class={styles.storageContainer}>
          <div class={styles.storageChart}>
            <div>
              <span>Storage</span>
              <span>6.5 GB of 10 GB used</span>
            </div>
            <div class={styles.spaces}>
              <span class={`${styles.storage} ${styles.photos}`}></span>
              <span class={`${styles.storage} ${styles.lives}`}></span>
              <span class={`${styles.storage} ${styles.videos}`}></span>
              <span class={`${styles.storage} ${styles.others}`}></span>
              <span class={`${styles.storage} ${styles.freeStorages}`} id="free-storages">
                20.5 GB
              </span>
            </div>

            <div class={styles.legendStorage}>
              <div class={`${styles.coloricon} ${styles.photos}`}></div> Photos
              <div class={`${styles.coloricon} ${styles.lives}`}></div> Lives
              <div class={`${styles.coloricon} ${styles.videos}`}></div> Videos
              <div class={`${styles.coloricon} ${styles.others}`}></div> Others
              <div class={`${styles.coloricon} ${styles.freeStorages}`}></div> Free
            </div>
          </div>
        </div>

        <div>
          <a href="/admin">.</a>
        </div>

        {/* =================================================== */}

        <button
          class="closeButton"
          onClick={() => {
            const popover = document.getElementById("setting-contents");
            if (popover) popover.hidePopover();
          }}>
          {CloseIcon()}
        </button>
      </>
    </>
  );
};

export default Setting;
