import styles from "./Setting.module.css";
import { createMemo, createResource } from "solid-js";
import AccountButton from "../../components/photoview/buttons/AccountButton";
import { CloseIcon, ServerIcon } from "../../components/svgIcons";
import { fetchCapacity } from "../../components/extents/request/fetching";
import { createStore } from "solid-js/store";
import { convertFileSize } from "../../components/extents/helper/helper";
import StorageBreakdown from "./storage/StorageBreakdown";

type SpaceInfo = {
  total: number;
  used: number;
  free: number;
  photo: number;
  live: number;
  video: number;
  all: number;
  other: number;
};

const defaultSpaceInfo: SpaceInfo = {
  total: 0,
  used: 0,
  free: 0,
  photo: 0,
  live: 0,
  video: 0,
  all: 0,
  other: 0,
};

const Setting = () => {
  const [spaceInfo, setSpaceInfo] = createStore<SpaceInfo>(defaultSpaceInfo);

  const [_loaded, { refetch }] = createResource(async () => {
    try {
      const newData: SpaceInfo = await fetchCapacity();
      if (newData) setSpaceInfo(serverCapacity(newData));
    } catch (error) {
      console.error("Error fetching server capacity:", error);
    }
  });

  // Optimized memoization to avoid unnecessary recalculations
  const storageInfo = createMemo(() => {
    const { used, total } = spaceInfo;
    return {
      used: convertFileSize(used),
      total: convertFileSize(total),
      freeSpace: convertFileSize(total - used),
    };
  });

  let popoverSetting: HTMLDivElement;

  return (
    <>
      <button onClick={() => refetch()} popovertarget="setting-contents">
        {ServerIcon()}
      </button>
      <div ref={(el) => (popoverSetting = el)} popover="auto" id="setting-contents" class="setting_contents">
        <header style={{ position: "relative" }}>
          <div inert>
            <h1>Server Info</h1>
          </div>
          <div class="buttonContainer">
            <AccountButton />
          </div>
        </header>

        <div class={styles.storageContainer}>
          <div class={styles.storageChart}>
            <div>
              <span>Storage</span>
              <span>
                {storageInfo().used} of {storageInfo().total} used
              </span>
            </div>
            <div class={styles.spaces}>
              <span style={{ width: `${spaceInfo.photo}%` }} class={`${styles.storage} ${styles.photos}`}></span>
              <span style={{ width: `${spaceInfo.live}%` }} class={`${styles.storage} ${styles.lives}`}></span>
              <span style={{ width: `${spaceInfo.video}%` }} class={`${styles.storage} ${styles.videos}`}></span>
              <span style={{ width: `${spaceInfo.other}%` }} class={`${styles.storage} ${styles.others}`}></span>
              <span style={{ width: `${spaceInfo.free}%` }} class={`${styles.storage} ${styles.freeStorages}`}>
                {storageInfo().freeSpace}
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

        <button
          class="closeButton"
          onClick={() => {
            if (popoverSetting) popoverSetting.hidePopover();
          }}>
          {CloseIcon()}
        </button>

        <StorageBreakdown />
      </div>
    </>
  );
};

export default Setting;

{
  /* <div class={styles.barChart}>
          <canvas id="barChart" data-chartjs={JSON.stringify({})}></canvas>
        </div> */
}
const serverCapacity = (svCap: SpaceInfo): SpaceInfo => {
  if (!svCap) return defaultSpaceInfo;

  const total = svCap.total;
  const used = svCap.used;

  const photo = (svCap.photo / total) * 100;
  const live = (svCap.live / total) * 100;
  const video = (svCap.video / total) * 100;

  const other = ((used - svCap.all) / total) * 100;
  const free = (svCap.free / total) * 100;

  return { free, photo, live, video, other, total, used, all: svCap.all };
};
