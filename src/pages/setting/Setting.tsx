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
              <div class={`${styles.coloricon} ${styles.freeStorages}`}></div> Free storage
            </div>
          </div>
        </div>

        <div>
          <a href="/admin">.</a>
        </div>

        {/* =================================================== */}

        <h3>ReIndex</h3>
        <div class={styles.reindexForm}>
          <fieldset>
            <legend>Select preferred index for medias:</legend>
            <div>
              <label for="importPath">Enter Main Directory:</label>
              <input
                class="inputSearch"
                type="text"
                name="importPath"
                id="importPath"
                autocomplete="off"
                placeholder="/Home/Sonomas"
                // onInput={(e) => setImportPath(e.target.value)}
              />
            </div>
            <div>
              <input
                type="checkbox"
                name="importMedias"
                id="importMedias"
                value="importMedias"
                // checked={importMedias()}
                // onChange={() => setImportMedias(!importMedias())}
              />
              <label for="importMedias">Import All Data to Photo TSX</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="detectModel"
                id="detectModel"
                value="detectModel"
                // checked={detectModel()}
                // onChange={() => setDetectModel(!detectModel())}
              />
              <label for="detectModel">AI Detection Mode</label>
            </div>
            <button class={styles.processButtons}>Progress</button>
          </fieldset>
        </div>

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
