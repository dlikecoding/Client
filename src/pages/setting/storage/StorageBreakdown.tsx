import styles from "../Setting.module.css";
import { createSignal, onMount } from "solid-js";
import { convertFileSize } from "../../../components/extents/helper/helper";

export default function StorageInfo() {
  const [storageData, setStorageData] = createSignal({
    quota: 0,
    usage: 0,
  });

  async function collectStorageInfo() {
    const estimate = (await navigator.storage.estimate()) || {};

    setStorageData({
      quota: estimate.quota || 0,
      usage: estimate.usage || 0,
    });
  }

  onMount(() => {
    collectStorageInfo();
  });

  return (
    <>
      <div class={styles.storageContainer}>
        <div class={styles.storageChart}>
          <div>
            <span>Client Info</span>
            <span>
              {convertFileSize(storageData().usage)} of {convertFileSize(storageData().quota)} used
            </span>
          </div>
          <div class={styles.spaces}>
            <span style={{ width: `${storageData().usage}%` }} class={`${styles.storage} ${styles.others}`}></span>
            <span
              style={{ width: `${storageData().quota - storageData().usage}%` }}
              class={`${styles.storage} ${styles.freeStorages}`}></span>
          </div>

          <div class={styles.legendStorage}>
            <div class={`${styles.coloricon} ${styles.others}`}></div> Used
            <div class={`${styles.coloricon} ${styles.freeStorages}`}></div> Free
          </div>
        </div>
      </div>
    </>
  );
}
