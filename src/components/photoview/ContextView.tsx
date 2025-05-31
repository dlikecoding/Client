import style from "./PhotoView.module.css";

import { useParams } from "@solidjs/router";
import { useIntersectionObserver, useWindowSize } from "solidjs-use";
import { createMemo, createResource, createSignal, For, onCleanup, Show } from "solid-js";

import { useMediaContext } from "../../context/Medias";
import { SearchQuery, useManageURLContext } from "../../context/ManageUrl";
import { MediaType, useViewMediaContext } from "../../context/ViewContext";

import { fetchMedias } from "../extents/request/fetching";

import PhotoCard from "./PhotoCard";
import NotFound from "../extents/NotFound";
import DeviceFilter from "./buttons/DeviceFilter";
import ActionNav from "./actionNav/ActionNav";
import Loading from "../extents/Loading";
import Select from "./buttons/Select";
import ModalView from "../modal/ModalView";
import { getElementBySelector } from "../extents/helper/helper";
import FilterPhotoView from "./buttons/FilterPhotoView";

const viewPageTitles = new Map([
  ["favorite", "Favorite"],
  ["deleted", "Recently Deleted"],
  ["hidden", "Hidden"],
  ["duplicate", "Duplicate"],
  ["all", "Library"],
  ["album", "Album"],
  ["dataset", "Dataset"],
  ["search", "Search"],
]);

const HIDE_SELECT_BUTTON = 5; // Hide select button when number of column > 5
const BUFFER_ROWS = 3; // number of rows buffering

const ContextView = () => {
  const paramsUrl = useParams();

  const { isSelected } = useMediaContext();
  const { params, view, resetLibrary } = useManageURLContext();
  const { openModal, displayMedias, setDisplayMedia } = useViewMediaContext();

  const queries = (): SearchQuery => ({
    year: params.year,
    month: params.month,
    filterDevice: params.filterDevice,
    filterType: params.filterType,

    searchKey: params.searchKey,

    sortKey: params.sortKey,
    sortOrder: params.sortOrder,

    favorite: params.favorite,
    hidden: params.hidden,
    deleted: params.deleted,
    duplicate: params.duplicate,

    albumId: paramsUrl.id ? parseInt(paramsUrl.id) : undefined,
  });

  const [pageNumber, setPageNumber] = createSignal(0);
  const [lastEl, setLastEl] = createSignal<HTMLElement | null>();

  useIntersectionObserver(lastEl, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      setLastEl(null); //console.log("Hey, I'm visible");
      setPageNumber((prev) => prev + 1);
    }
  });

  /** When last element is visible on the DOM, remove from the lastEl,
   * and then load more element to dom (only ONCE)*/
  const lastElement = () => {
    // If lastEl exist, since setLastEl inside Index loop, return.
    const lastEl = getElementBySelector("idx", displayMedias.length - 1);
    if (lastEl) setLastEl(lastEl); // Set lastEl everytime user change sort or filter.
  };

  const [loadedMedias] = createResource(queries, async (searchParams: SearchQuery) => {
    const newMedia: MediaType[] | undefined = await fetchMedias(searchParams);
    if (newMedia) {
      setDisplayMedia(newMedia); // Reset displayMedia with new fetching data
      setPageNumber(0); // set the page to 0
      lastElement(); // get the last element of the new fetched page as a new lastEl
    }
  });

  const [loadedMoreMedias] = createResource(pageNumber, async (currentPage) => {
    if (currentPage === 0) return;
    const newMedia: MediaType[] | undefined = await fetchMedias(queries(), currentPage);
    if (newMedia) setDisplayMedia((prev) => [...prev!, ...newMedia]);
  });

  ///////////////// Virtualization ContextView /////////////////////////////////////////////////
  let containerRef!: HTMLDivElement;

  const { width, height } = useWindowSize();
  const [scrollTop, setScrollTop] = createSignal(0);

  const itemDimention = createMemo(() => width() / view.nColumn);

  const VISIBLE_ITEM = createMemo(() => (Math.ceil(height() / itemDimention()) + BUFFER_ROWS) * view.nColumn);

  const startIndex = createMemo(() =>
    Math.max(0, (Math.floor(scrollTop() / itemDimention()) - BUFFER_ROWS) * view.nColumn)
  );

  const endIndex = createMemo(() =>
    Math.min(displayMedias.length - 1, startIndex() + VISIBLE_ITEM() + BUFFER_ROWS * view.nColumn)
  );

  const visibleRows = createMemo(() => {
    if (displayMedias.length === 0) return [];

    const start = startIndex(); // track
    const end = endIndex(); // track
    return displayMedias.slice(start, end + 1); // new array
  });

  // Reset params on closed (This dose not reset year and month )
  onCleanup(() => resetLibrary());

  const calculateTopPadding = createMemo(() => {
    const minPadding = paramsUrl.pages === "all" ? height() - 170 : height() - 130;
    return Math.max(minPadding, Math.ceil(displayMedias.length / view.nColumn) * itemDimention());
  });

  return (
    <main class="mainHomePage" style={{ overflow: "hidden" }}>
      <header style={{ "z-index": 1 }}>
        <div inert>
          <h1>{viewPageTitles.get(paramsUrl.pages)}</h1>
          <Show when={displayMedias.length}>
            <p>
              {toDate(displayMedias[startIndex()])} - {toDate(displayMedias[endIndex()])}
            </p>
          </Show>
        </div>
        <div class="buttonContainer" style={{ "margin-top": "10px" }}>
          <DeviceFilter />
          <Show when={view.nColumn <= HIDE_SELECT_BUTTON}>
            <Select />
          </Show>
          <FilterPhotoView />
        </div>
      </header>

      <div
        ref={containerRef}
        class={style.container}
        onScroll={(event: Event) => {
          event.preventDefault();
          setScrollTop(containerRef.scrollTop);

          const popovers = document.querySelectorAll<HTMLElement>("div[popover]");
          popovers.forEach((eachPopover: HTMLElement) => {
            if (eachPopover.checkVisibility()) eachPopover.hidePopover();
          });
        }}>
        <Show when={loadedMedias.loading || loadedMoreMedias.loading}>
          <Loading />
        </Show>

        <Show when={!displayMedias.length}>
          <NotFound errorCode={"Not Found"} message={"Page you're looking for could not be found"} />
        </Show>

        <div
          class={style.virtualContainer}
          style={{ height: `${(displayMedias.length / view.nColumn) * itemDimention()}px` }}>
          <For each={visibleRows()}>
            {(media, index) => (
              <PhotoCard
                lastItem={displayMedias.length - 1 === startIndex() + index() ? setLastEl : undefined}
                media={media}
                index={startIndex() + index()}
                itemDim={itemDimention()}
              />
            )}
          </For>

          <div
            class={style.paddingInfo}
            style={{
              height: `${paramsUrl.pages === "all" ? 140 : 100}px`,
              top: `${calculateTopPadding()}px`,
            }}>
            {displayMedias.length} Photos and Videos
          </div>
        </div>
      </div>

      <Show when={isSelected()}>
        <ActionNav />
      </Show>

      <Show when={openModal()}>
        <ModalView setLastEl={setLastEl} startIdxView={startIndex} endIdxView={endIndex} />
      </Show>
    </main>
  );
};

export default ContextView;

const toDate = (mediaType: MediaType): string => {
  if (!mediaType) return "";
  const date = new Date(mediaType.create_date);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};
