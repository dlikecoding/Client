import styles from "./Group.module.css";

import { createResource, Index, Match, Switch } from "solid-js";
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
        <Switch fallback={<NotFound errorCode="Not Found 404" message="No data available for the selected period." />}>
          <Match when={loadedMedias.loading}>
            <Loading />
          </Match>

          <Match when={loadedMedias.error}>
            <NotFound />
          </Match>

          <Match when={loadedMedias()}>
            <Index each={loadedMedias()}>
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
          </Match>
        </Switch>
      </div>
    </>
  );
};

export default YearView;
