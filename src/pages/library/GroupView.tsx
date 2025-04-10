import styles from "./Group.module.css";

import { createMemo, createResource, createSignal, Index, Match, onMount, Switch } from "solid-js";
import NotFound from "../../components/extents/NotFound";

import { useLocation } from "@solidjs/router";

import { useManageURLContext } from "../../context/ManageUrl";
import { fetchMediaYears } from "../../components/extents/request/fetching";
import Loading from "../../components/extents/Loading";
import ByMonths from "./Groups/ByMonths";
import ByYears from "./Groups/ByYears";
import { createStore } from "solid-js/store";
import { Dynamic } from "solid-js/web";

interface GroupMedia {
  create_year: string;
  thumb_path: string;
  media_id: number;
  file_type: string;
  create_month: string;
  create_date: string;
}

const GroupView = () => {
  const { params } = useManageURLContext();
  const [loadedMedias] = createResource(fetchMediaYears);

  const location = useLocation();
  const isYear = createMemo(() => {
    return location.pathname === "/library/";
  });

  const displayMedias = createMemo<GroupMedia[]>(() => {
    const data = loadedMedias();
    if (!data) return [];
    if (isYear()) {
      const uniqueByYear = new Map(data.map((media: GroupMedia) => [media.create_year, media]));
      return Array.from(uniqueByYear.values());
    }
    return data;
  });

  return (
    <div class={styles.groupContainer}>
      <Switch fallback={<NotFound errorCode="Not Found 404" message="No data available for the selected period." />}>
        <Match when={loadedMedias.loading}>
          <Loading />
        </Match>

        <Match when={loadedMedias.error}>
          <NotFound />
        </Match>

        <Match when={displayMedias().length > 0}>
          <Dynamic component={isYear() ? ByYears : ByMonths} medias={displayMedias()} />
        </Match>
      </Switch>
    </div>
  );
};

export default GroupView;
