import styles from "./Group.module.css";

import { createResource, Index, Show } from "solid-js";
import NotFound from "../../components/extents/NotFound";

import { A } from "@solidjs/router";

import { useManageURLContext } from "../../context/ManageUrl";
import { fetchMediaYears } from "../../components/extents/request/fetching";
import Loading from "../../components/extents/Loading";
const YearView = () => {
  const { updatePage } = useManageURLContext();
  const [loadedMedias] = createResource(fetchMediaYears);

  return (
    <>
      <div class={styles.groupContainer}>
        <Show when={loadedMedias.loading}>
          <Loading />
        </Show>

        <Index each={loadedMedias()} fallback={<NotFound />}>
          {(photo) => (
            <A
              class={styles.mediaContainer}
              onClick={() => {
                updatePage({ year: photo().timeFormat });
              }}
              href="/library/month">
              <div class={styles.overlayText}>
                <h3>{photo().timeFormat}</h3>
              </div>
              <img loading="lazy" alt="Year Photos" src={photo().ThumbPath} />
            </A>
          )}
        </Index>
      </div>
    </>
  );
};

export default YearView;
