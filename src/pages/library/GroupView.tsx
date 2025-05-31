import styles from "./Group.module.css";
import { Dynamic } from "solid-js/web";
import { createMemo, createResource, Index, Match, Switch } from "solid-js";
import { useLocation } from "@solidjs/router";

import NotFound from "../../components/extents/NotFound";
import Loading from "../../components/extents/Loading";
import { fetchMediaYears } from "../../components/extents/request/fetching";
import Years from "./Years";
import Months from "./Months";

export interface GroupMedia {
  create_year: number;
  create_month: number;
  thumb_path: string;
  media_id: number;
  file_type: string;
  create_date: string;
}

const GroupView = () => {
  const [loadedMedias] = createResource(fetchMediaYears);

  const location = useLocation();
  const isYear = createMemo(() => location.pathname === "/library/");

  const displayMedias = createMemo<GroupMedia[]>(() => {
    const data = loadedMedias();
    if (!data) return [];
    return isYear() ? filterUniqueByKey(data) : data;
  });

  return (
    <main class={`mainHomePage ${styles.groupContainer}`}>
      <Switch fallback={<NotFound errorCode="Not Found 404" message="No data available for the selected period." />}>
        <Match when={loadedMedias.loading}>
          <Loading />
        </Match>

        <Match when={displayMedias().length > 0}>
          <Index each={displayMedias()}>
            {(photo) => <Dynamic component={isYear() ? Years : Months} photo={photo()} />}
          </Index>
        </Match>
      </Switch>
    </main>
  );
};

export default GroupView;

const filterUniqueByKey = (medias: GroupMedia[]) => {
  const seen = new Set();

  return medias.filter((media: GroupMedia) => {
    const value = media.create_year;
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};
