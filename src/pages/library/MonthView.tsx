import styles from "./Group.module.css";

import { createEffect, createMemo, createResource, createSignal, Index, Match, onMount, Switch } from "solid-js";
import NotFound from "../../components/extents/NotFound";

import { A } from "@solidjs/router";

import { useManageURLContext } from "../../context/ManageUrl";
import { fetchMediaMonths } from "../../components/extents/request/fetching";
import Loading from "../../components/extents/Loading";

const MonthView = () => {
  const { params, updatePage } = useManageURLContext();
  const [loadedMedias] = createResource(() => fetchMediaMonths(params.year || "0"));

  // const [targetRef, setTargetRef] = createSignal<HTMLAnchorElement | null>(null);
  // createMemo(() => {
  //   const ref = targetRef(); // Access the reactive value

  //   ref?.scrollIntoView({ behavior: "instant" }); // Example action
  // });
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
            <Index each={loadedMedias()} fallback={<NotFound />}>
              {(photo, index) => {
                return (
                  <A
                    // ref={(el) =>
                    //   photo().createAtYear === params.year && photo().createAtMonth === params.month
                    //     ? setTargetRef(el)
                    //     : undefined
                    // }
                    class={styles.monthViewContainer}
                    onClick={() => {
                      updatePage({ year: photo().createAtYear, month: photo().createAtMonth });
                    }}
                    href="/library/all">
                    <h3 class={styles.titleMonthView}>{photo().timeFormat}</h3>

                    <div class={styles.overlayDay}>{photo().createAtDate}</div>
                    <img loading="lazy" alt="Month Photos" src={photo().ThumbPath} />
                  </A>
                );
              }}
            </Index>
          </Match>
        </Switch>
      </div>
    </>
  );
};

export default MonthView;
