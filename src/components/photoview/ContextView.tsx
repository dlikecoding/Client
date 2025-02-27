import style from "./PhotoView.module.css";

import { useParams } from "@solidjs/router";
import { useElementByPoint, useIntersectionObserver } from "solidjs-use";
import { createEffect, createMemo, createResource, createSignal, For, Index, onCleanup, onMount, Show } from "solid-js";

import { useMediaContext } from "../../context/Medias";
import { SearchQuery, useManageURLContext } from "../../context/ManageUrl";
import { MediaType, useViewMediaContext } from "../../context/ViewContext";

import { fetchMedias } from "../extents/request/fetching";

import { getTitle } from "../../App";

import PhotoCard from "./PhotoCard";
import NotFound from "../extents/NotFound";
import DeviceFilter from "./buttons/DeviceFilter";
import ActionNav from "./actionNav/ActionNav";
import Loading from "../extents/Loading";
import Modal from "../modal/Modal";
import Select from "./buttons/Select";

const HIDE_SELECT_BUTTON = 5; // Hide select button when number of column > 5

// interface Elements {
//   start?: HTMLElement | null;
//   end?: HTMLElement | null;
// }

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
    filterObject: params.filterObject,
    sortKey: params.sortKey,
    sortOrder: params.sortOrder,

    favorite: params.favorite,
    hidden: params.hidden,
    deleted: params.deleted,
    duplicate: params.duplicate,

    albumId: paramsUrl.id,
  });

  const [pageNumber, setPageNumber] = createSignal(0);
  const [target, setTarget] = createSignal<HTMLElement | null>();

  useIntersectionObserver(target, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      setTarget(null);
      setPageNumber((prev) => prev + 1);
    }
  });

  /** When last element is visible on the DOM, remove from the target,
   * and then load more element to dom (only ONCE)*/
  const lastElement = () => {
    if (target()) return; // If target exist, since setTarget inside Index loop, run return.
    const lastEl = getLastElement(displayMedias.length - 1);
    setTarget(lastEl); // Set target everytime user change sort or filter.
  };

  const [loadedMedias] = createResource(queries, async (searchParams: SearchQuery) => {
    const newMedia: MediaType[] | null = await fetchMedias(searchParams);
    if (newMedia) {
      setDisplayMedia(newMedia); // Reset displayMedia with new fetching data
      setPageNumber(0); // set the page to 0
      lastElement(); // get the last element of the new fetched page as a new target
    }
  });

  const [loadedMoreMedias] = createResource(pageNumber, async (currentPage) => {
    if (currentPage === 0) return;
    const newMedia: MediaType[] | null = await fetchMedias(queries(), currentPage);
    if (newMedia) setDisplayMedia((prev) => [...prev!, ...newMedia]);
  });

  // Reset params on closed (This dose not reset year and month )
  onCleanup(() => resetLibrary());
  // Change number of column when in duplicate page. Otherwise, keep the preveous.
  //// NOT SURE IF NEEDED

  //Tracking current element on screen based on x and y
  const { element: startEl } = useElementByPoint({ x: 20, y: 20 });
  const { element: endEl } = useElementByPoint({ x: 20, y: window.innerHeight - 1 });

  const displayTime = createMemo(() => {
    if (openModal()) return;
    const sElement = startEl();
    const eElement = endEl();

    if (!sElement || !eElement) return;

    const sTime = sElement.dataset.time;
    const eTime = eElement.dataset.time;
    if (!sTime || !eTime) return;
    return `${sTime} - ${eTime}`;
  });

  return (
    <>
      <header style={{ "z-index": 1 }}>
        <div inert>
          <h1>{getTitle(paramsUrl.pages)}</h1>
          <p>{displayTime()}</p>
        </div>
        <div class="buttonContainer" style={{ "margin-top": "10px" }}>
          <Show when={view.nColumn <= HIDE_SELECT_BUTTON}>
            <Select />
          </Show>
          <DeviceFilter />
        </div>
      </header>

      <div
        class={style.container}
        onScroll={(event: Event) => {
          event.preventDefault();

          const popovers = document.querySelectorAll<HTMLElement>("div[popover]");
          popovers.forEach((eachPopover: HTMLElement) => {
            if (!eachPopover.checkVisibility()) return;
            eachPopover.hidePopover();
          });
        }}>
        <Show when={loadedMedias.loading || loadedMoreMedias.loading}>
          <Loading />
        </Show>

        <Index
          each={displayMedias}
          fallback={<NotFound errorCode={"Not Found"} message={"Page you're looking for could not be found"} />}>
          {(media, index) => (
            <PhotoCard
              lastItem={displayMedias.length - 1 === index ? setTarget : undefined}
              media={media()}
              index={index}
            />
          )}
        </Index>
      </div>

      <Show when={isSelected()}>
        <ActionNav />
      </Show>

      <Show when={openModal()}>
        <Modal />
      </Show>
    </>
  );
};

export default ContextView;

const elPointToTime = (elStart: HTMLElement, elEnd: HTMLElement) => {
  if (!elStart || !elEnd) return { start: "", end: "" };

  const sTime = elStart.dataset.time;
  const eTime = elEnd.dataset.time;
  if (sTime && eTime) {
    return { sTime, eTime };
  }
  return { start: "", end: "" };
};

const getLastElement = (index: number) => {
  return document.querySelector<HTMLElement>(`[data-idx="${index}"]`);
};
/* <p> PhotoView - ID: {params.id} - Page: {params.pages} </p> */
