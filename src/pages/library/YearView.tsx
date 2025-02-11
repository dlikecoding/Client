import { For } from "solid-js";
import NotFound from "../../components/extents/NotFound";
import styles from "./Group.module.css";
import { A } from "@solidjs/router";

import sample from "../../components/300.png";
const YearView = () => {
  const loadedMedias = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div class={styles.groupContainer}>
      {/* {loadedMedias?.loading && <Loading />} */}
      {!loadedMedias && <NotFound />}
      <For each={loadedMedias}>
        {(photo) => (
          <A
            href="#"
            class={styles.mediaContainer}
            on:click={() => {
              // updatePage({ year: photo.timeFormat, month: "" });
            }}>
            <div class={styles.overlayText}>{/* <h3>{photo.timeFormat}</h3> */}</div>
            <img loading="lazy" alt="Group Photos" src={sample} />
          </A>
        )}
      </For>
    </div>
  );
};

export default YearView;
