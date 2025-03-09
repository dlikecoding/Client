import { CloseIcon } from "../../components/svgIcons";
import styles from "./Setting.module.css";

const Setting = () => {
  console.log("Setting");

  return (
    <>
      {/* <h1>Setting</h1>
      <div> Display storage ===================</div>
      <div> Reindex ===================</div>
      <div>Link</div>
      <div>Link</div>
      <div>Link</div>
      <div>Link</div>
       */}

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
        <form class={styles["form-container"]} action="/setting" method="post">
          <fieldset>
            <legend>Select preferred index for medias:</legend>

            <ul>
              <li>
                <label for="importPath">Folder's name:</label>
                <input
                  id="importPath"
                  type="text"
                  name="importPath"
                  autocomplete="off"
                  placeholder="~/Sonomas/2020-20 ... "
                  value={"importPath"}
                  // onInput={(e) => setImportPath(e.target.value)}
                />
              </li>
              <li>
                <input
                  type="checkbox"
                  id="importMedias"
                  name="importMedias"
                  value="importMedias"
                  // checked={importMedias()}
                  // onChange={() => setImportMedias(!importMedias())}
                />
                <label for="importMedias">Import All Data to Photo TSX</label>
              </li>
              <li>
                <input
                  type="checkbox"
                  id="importClient"
                  name="importClient"
                  value="importClient"
                  // checked={importClient()}
                  // onChange={() => setImportClient(!importClient())}
                />
                <label for="importClient">Import data for client DB</label>

                <ul>
                  <li>
                    <input
                      type="checkbox"
                      id="hashKey"
                      name="hashKey"
                      value="hashKey"
                      // checked={hashKey()}
                      // onChange={() => setHashKey(!hashKey())}
                    />
                    <label for="hashKey">Hash 256 Generate</label>
                  </li>
                </ul>
              </li>

              <li>
                <input
                  type="checkbox"
                  id="detectModel"
                  name="detectModel"
                  value="detectModel"
                  // checked={detectModel()}
                  // onChange={() => setDetectModel(!detectModel())}
                />
                <label for="detectModel">AI Detection Mode</label>
              </li>
            </ul>
          </fieldset>
          <button class={styles.buttons} type="submit">
            Progress
          </button>
        </form>

        <button
          class={styles.closeButton}
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
