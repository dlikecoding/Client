import styles from "./Group.module.css";

import { createResource, For, Show } from "solid-js";
import NotFound from "../../components/extents/NotFound";

import { A } from "@solidjs/router";

import { useManageURLContext } from "../../context/ManageUrl";
import { fetchMediaYears } from "../../components/extents/request/fetching";
const YearView = () => {
  const { updatePage } = useManageURLContext();
  const [loadedMedias] = createResource(fetchMediaYears);

  return (
    <>
      <div class={styles.groupContainer}>
        <Show when={loadedMedias.error}>
          <NotFound />
        </Show>

        <For each={loadedMedias()} fallback={<div>Loading... </div>}>
          {(photo) => (
            <A
              class={styles.mediaContainer}
              on:click={() => {
                updatePage({ year: photo.timeFormat });
              }}
              href="/library/month">
              <div class={styles.overlayText}>
                <h3>{photo.timeFormat}</h3>
              </div>
              <img loading="lazy" alt="Year Photos" src={photo.ThumbPath} />
            </A>
          )}
        </For>
      </div>
    </>
  );
};

export default YearView;
