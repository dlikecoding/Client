import { useParams } from "@solidjs/router";
import { createEffect, createResource, createSignal, For, Show, Suspense } from "solid-js";
import style from "./PhotoView.module.css";

import Select from "./buttons/Select";
import { useMediaContext } from "../../context/Medias";
import { MediaType, SearchQuery, useManageURLContext } from "../../context/ManageUrl";
import { fetchMedias } from "../extents/request/fetching";
import PhotoCard from "./PhotoCard";
import { useIntersectionObserver } from "solidjs-use";
import NotFound from "../extents/NotFound";
import { TransitionGroup } from "solid-transition-group";
import DeviceFilter from "./buttons/DeviceFilter";
import ActionNav from "./actionNav/ActionNav";
import Loading from "../extents/Loading";

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

const PhotoView = () => {
  const paramsUrl = useParams();
  const currentPage = pages[paramsUrl.pages as keyof typeof pages];

  const { isSelected } = useMediaContext();
  const { params, resetParams, displayMedias, setDisplayMedia } = useManageURLContext();

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

  const [loadedMedias] = createResource(queries, async (searchParams: SearchQuery) => {
    const newMedia: MediaType[] | null = await fetchMedias(searchParams);
    if (newMedia) setDisplayMedia(newMedia);
  });

  const [loadedMoreMedias] = createResource(pageNumber, async (currentPage) => {
    if (currentPage === 0) return;
    const newMedia: MediaType[] | null = await fetchMedias(queries(), currentPage);
    if (newMedia) setDisplayMedia((prev) => [...prev, ...newMedia]);
  });

  return (
    <Suspense fallback={<Loading />}>
      <header style={{ "z-index": 1 }}>
        <div>
          <h1>{currentPage}</h1>
          <p>Aug 8, 2025</p>
        </div>
        <div class="buttonContainer" style={{ "margin-top": "10px" }}>
          <Select />
          <DeviceFilter />
        </div>
      </header>

      <div class={style.container}>
        <Show when={!displayMedias.length || loadedMedias.error || loadedMoreMedias.error}>
          <NotFound errorCode={"Not Found"} message={"Page you're looking for could not be found"} />
        </Show>

        {/* <Show when={loadedMedias.loading || loadedMoreMedias.loading}>
          <div>Loading ...</div>
        </Show> */}

        <TransitionGroup
          onExit={(el, done) => {
            el.animate([]).finished.then(done);
          }}>
          <For each={displayMedias}>
            {(media, index) =>
              displayMedias!.length - 1 === index() ? (
                <PhotoCard lastItem={setTarget} media={media} index={index()} />
              ) : (
                <PhotoCard media={media} index={index()} />
              )
            }
          </For>
        </TransitionGroup>
      </div>

      {/* <p>
        PhotoView - ID: {params.id} - Page: {params.pages}
      </p> */}

      <Show when={isSelected()}>
        <ActionNav />
      </Show>
    </Suspense>
  );
};

export default PhotoView;
