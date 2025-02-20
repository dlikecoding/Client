import styles from "./Group.module.css";

import { createResource, For, Show } from "solid-js";
import NotFound from "../../components/extents/NotFound";

import { A } from "@solidjs/router";

import { useManageURLContext } from "../../context/ManageUrl";
import { fetchMediaMonths } from "../../components/extents/request/fetching";
import Loading from "../../components/extents/Loading";

const MonthView = () => {
  const { params, updatePage } = useManageURLContext();
  const [loadedMedias] = createResource(() => fetchMediaMonths(params.year || "0"));

  return (
    <>
      <div class={styles.groupContainer}>
        <Show when={loadedMedias.loading}>
          <Loading />
        </Show>

        <For each={loadedMedias()} fallback={<NotFound />}>
          {(photo) => (
            <A
              class={styles.monthViewContainer}
              on:click={() => {
                updatePage({ year: photo.createAtYear, month: photo.createAtMonth });
              }}
              href="/library/all">
              <h3 class={styles.titleMonthView}>{photo.timeFormat}</h3>
              <div class={styles.overlayDay}>{photo.createAtDate}</div>
              <img loading="lazy" alt="Month Photos" src={photo.ThumbPath} />
            </A>
          )}
        </For>
      </div>
    </>
  );
};

export default MonthView;
