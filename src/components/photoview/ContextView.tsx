import { useParams } from "@solidjs/router";
import { createEffect, createResource, createSignal, For, onCleanup, Show, Suspense } from "solid-js";
import style from "./PhotoView.module.css";

import Select from "./buttons/Select";
import { useMediaContext } from "../../context/Medias";
import { SearchQuery, useManageURLContext } from "../../context/ManageUrl";
import { fetchMedias } from "../extents/request/fetching";
import PhotoCard from "./PhotoCard";
import { useIntersectionObserver } from "solidjs-use";
import NotFound from "../extents/NotFound";
import { TransitionGroup } from "solid-transition-group";
import DeviceFilter from "./buttons/DeviceFilter";
import ActionNav from "./actionNav/ActionNav";
import Loading from "../extents/Loading";
import { MediaType, useViewMediaContext } from "../../context/ViewContext";

const pages = {
  favorite: "Favorite",
  deleted: "Recently Deleted",
  hidden: "Hidden",
  duplicate: "Duplicate",
  all: "Library",
  album: "Album",
  dataset: "Dataset",
  search: "Search",
};

const ContextView = () => {
  const paramsUrl = useParams();
  const currentPage = pages[paramsUrl.pages as keyof typeof pages];

  const { isSelected } = useMediaContext();
  const { params, view, resetParams } = useManageURLContext();
  const { displayMedias, setDisplayMedia } = useViewMediaContext();

  const [pageNumber, setPageNumber] = createSignal(0);
  const [target, setTarget] = createSignal<HTMLElement | null>(null);

  const [isVisible, setIsVisible] = createSignal(false);
  useIntersectionObserver(target, ([{ isIntersecting }]) => {
    setIsVisible(isIntersecting);
  });

  /** When last element is visible on the DOM, remove from the target,
   * and then load more element to dom (only ONCE)*/
  createEffect(() => {
    if (isVisible()) {
      setTarget(null);
      setPageNumber((prev) => prev + 1);
    }
  });

  const queries = (): SearchQuery => ({
    year: params.year,
    month: params.month,
    filterDevice: params.filterDevice,
    filterType: params.filterType,
    sortKey: params.sortKey,
    sortOrder: params.sortOrder,
  });

  const [loadedMedias, { mutate, refetch }] = createResource(queries, async (searchParams: SearchQuery) => {
    const newMedia: MediaType[] | null = await fetchMedias(searchParams);
    return setDisplayMedia(newMedia!);
  });

  const [loadedMoreMedias] = createResource(pageNumber, async (currentPage) => {
    if (currentPage === 0) return;
    const newMedia: MediaType[] | null = await fetchMedias(queries(), currentPage);
    if (newMedia) setDisplayMedia((prev) => [...prev!, ...newMedia]);
  });

  onCleanup(() => resetParams());

  return (
    <>
      <header style={{ "z-index": 1 }}>
        <div>
          <h1>{currentPage}</h1>
          <p>Aug 8, 2025</p>
        </div>
        <div class="buttonContainer" style={{ "margin-top": "10px" }}>
          <Show when={view.nColumn < 7}>
            <Select />
          </Show>
          <DeviceFilter />
        </div>
      </header>

      <div class={style.container}>
        <Show when={displayMedias.length === 0 || loadedMedias.error || loadedMoreMedias.error}>
          <NotFound errorCode={"Not Found"} message={"Page you're looking for could not be found"} />
        </Show>

        <Show when={loadedMedias.loading || loadedMoreMedias.loading}>
          <Loading />
        </Show>

        {/* <TransitionGroup
          onExit={(el, done) => {
            el.animate([]).finished.then(done);
          }}> */}
        <For each={displayMedias}>
          {(media, index) =>
            displayMedias.length - 1 === index() ? (
              <PhotoCard lastItem={setTarget} media={media} index={index()} />
            ) : (
              <PhotoCard media={media} index={index()} />
            )
          }
        </For>
        {/* </TransitionGroup> */}
      </div>

      {/* <p>
        PhotoView - ID: {params.id} - Page: {params.pages}
      </p> */}

      <Show when={isSelected()}>
        <ActionNav />
      </Show>
    </>
  );
};

export default ContextView;
