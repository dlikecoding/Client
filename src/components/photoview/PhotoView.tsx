import { useParams } from "@solidjs/router";
import { For } from "solid-js";
import style from "./PhotoView.module.css";

import sample from "../300.png";
import Select from "./buttons/Select";
import { MoreButtonIcon } from "../svg-icons";

const PhotoView = () => {
  const params = useParams();

  const pages = {
    favorite: "Favorite",
    deleted: "Recently Deleted",
    hidden: "Hidden",
    duplicate: "Duplicate",
    all: "Library",
    album: "Album",
    dataset: "Dataset",
  };
  const currentPage = pages[params.pages as keyof typeof pages];

  const loadedMedias = [1, 2, 3, 4, 5, 6, 7, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  return (
    <>
      <header style={{ "z-index": 1 }}>
        <div>
          <h1>{currentPage}</h1>
          <p>Aug 8, 2025</p>
        </div>
        <div class="buttonContainer" style={{ "margin-top": "10px" }}>
          <Select />
          <button>{MoreButtonIcon()}</button>
        </div>
      </header>

      <div class={style.container}>
        <For each={loadedMedias}>
          {(media, index) => (
            <div class={style.mediaContainer}>
              <img src={sample} alt="" />
              {media} - {index()}
            </div>
          )}
        </For>
      </div>

      {/* <p>
        PhotoView - ID: {params.id} - Page: {params.pages}
      </p> */}
    </>
  );
};

export default PhotoView;
