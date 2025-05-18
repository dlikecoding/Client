// import { fetchCapacity } from "../../components/extents/request/fetching";
import { onMount } from "solid-js";
import AccountButton from "../../components/photoview/buttons/AccountButton";
import { CloseIcon } from "../../components/svgIcons";
import styles from "./Setting.module.css";
import { fetchCapacity } from "../../components/extents/request/fetching";
import { createStore } from "solid-js/store";
import { convertFileSize } from "../../components/extents/helper/helper";

type SpaceInfo = {
  total?: number;
  used?: number;
  free?: number;

  photo?: number;
  live?: number;
  video?: number;
  all?: number;

  other?: number;
};

const Setting = () => {
  const [spaceInfo, setSpaceInfo] = createStore<SpaceInfo>();

  onMount(async () => {
    const svCap = await fetchCapacity();

    const total = svCap.total;
    const used = svCap.used;

    const photo = (svCap.photo / total) * 100;
    const live = (svCap.live / total) * 100;
    const video = (svCap.video / total) * 100;

    const other = ((total - svCap.all) / total) * 100;
    const free = (svCap.free / total) * 100;

    setSpaceInfo({ free, photo, live, video, other, total, used });
  });
  console.log(spaceInfo);
  return (
    <>
      <header style={{ position: "relative" }}>
        <div inert>
          <h1>Server Info</h1>
        </div>
        <div class="buttonContainer">
          <AccountButton />
        </div>
      </header>
      {JSON.stringify(spaceInfo)}
      {/* <div class={styles.barChart}>
          <canvas id="barChart" data-chartjs={JSON.stringify({})}></canvas>
        </div> */}

      <div class={styles.storageContainer}>
        <div class={styles.storageChart}>
          <div>
            <span>Storage</span>
            <span>
              {convertFileSize(spaceInfo.used)} of {convertFileSize(spaceInfo.total)} used
            </span>
          </div>
          <div class={styles.spaces}>
            <span style={{ width: `${spaceInfo.photo}%` }} class={`${styles.storage} ${styles.photos}`}></span>
            <span style={{ width: `${spaceInfo.live}%` }} class={`${styles.storage} ${styles.lives}`}></span>
            <span style={{ width: `${spaceInfo.video}%` }} class={`${styles.storage} ${styles.videos}`}></span>
            <span style={{ width: `${spaceInfo.other}%` }} class={`${styles.storage} ${styles.others}`}></span>
            <span style={{ width: `${spaceInfo.free}%` }} class={`${styles.storage} ${styles.freeStorages}`}>
              {convertFileSize(spaceInfo.free)}
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
  );
};

export default Setting;
