import style from "./PhotoView.module.css";

import { useParams } from "@solidjs/router";
import { useElementByPoint, useIntersectionObserver } from "solidjs-use";
import { createEffect, createMemo, createResource, createSignal, For, onCleanup, Show } from "solid-js";

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

const ContextView = () => {
  const paramsUrl = useParams();

  const { isSelected } = useMediaContext();
  const { params, view, resetParams } = useManageURLContext();
  const { openModal, displayMedias, setDisplayMedia } = useViewMediaContext();

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
    filterObject: params.filterObject,
    sortKey: params.sortKey,
    sortOrder: params.sortOrder,

    favorite: params.favorite,
    hidden: params.hidden,
    deleted: params.deleted,
    duplicate: params.duplicate,

    albumId: paramsUrl.id,
  });

  const [loadedMedias] = createResource(queries, async (searchParams: SearchQuery) => {
    const newMedia: MediaType[] | null = await fetchMedias(searchParams);
    setDisplayMedia(newMedia!);
    return;
  });

  const [loadedMoreMedias] = createResource(pageNumber, async (currentPage) => {
    if (currentPage === 0) return;
    const newMedia: MediaType[] | null = await fetchMedias(queries(), currentPage);
    if (newMedia) setDisplayMedia((prev) => [...prev!, ...newMedia]);
  });

  onCleanup(() => resetParams());

  //Tracking current elemenet on screen based on x and y
  const { element } = useElementByPoint({ x: 100, y: 120 });

  const displayTime = () => {
    if (openModal()) return;

    if (element()) {
      const dTime = element()?.dataset.time; //console.log(dTime);
      if (dTime) return dTime;
    }
  };

  return (
    <>
      <header style={{ "z-index": 1 }}>
        <div>
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

      <div class={style.container}>
        <Show when={displayMedias.length === 0 || loadedMedias.error || loadedMoreMedias.error}>
          <NotFound errorCode={"Not Found"} message={"Page you're looking for could not be found"} />
        </Show>

        <Show when={loadedMedias.loading || loadedMoreMedias.loading}>
          <Loading />
        </Show>

        <For each={displayMedias}>
          {(media, index) =>
            displayMedias.length - 1 === index() ? (
              <PhotoCard lastItem={setTarget} media={media} index={index()} />
            ) : (
              <PhotoCard media={media} index={index()} />
            )
          }
        </For>
      </div>

      {/* <p>
        PhotoView - ID: {params.id} - Page: {params.pages}
      </p> */}

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
