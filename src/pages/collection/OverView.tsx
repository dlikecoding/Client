import { For, Suspense } from "solid-js";
import style from "./OverView.module.css";
import { A } from "@solidjs/router";

const OverView = () => {
  const loadedAlbums = [1, 2, 3, 4, 5, 6];

  const gotoPage: any = ["favorite", "hidden", "duplicate", "deleted"];

  return (
    <>
      <h1>Portfolio</h1>
      <h3>
        My Albums
        <button class={style.atag_group_views}>Edit</button>
      </h3>
      <div class={style.album_section}>
        <div class={style.cards}>
          <For each={loadedAlbums}>
            {(album, _) => (
              <A class={style.albumCard} href={`/collection/dataset/${album}`}>
                <img src={"album.ThumbPath"} alt="Focus Playlist" />
                <div> {"album.title"}</div>
                <p>{"album.media_count"}</p>
              </A>
            )}
          </For>
        </div>
      </div>

      {/* //////////////////////////// */}
      <h3>
        Dataset
        <button class={style.atag_group_views}>Edit</button>
      </h3>
      <div class={style.album_section}>
        <div class={style.cards}>
          <For each={loadedAlbums}>
            {(album, _) => (
              <A class={style.card} href={`/collection/dataset/${album}`}>
                <img src={"album.ThumbPath"} alt="Focus Playlist" />

                <div class={style.cardFooter}>
                  <div> {"album.title"}</div>
                  <p>{"album.media_count"}</p>
                </div>
              </A>
            )}
          </For>
        </div>
      </div>
      {/* //////////////////////////// */}

      <h3>Utilities</h3>
      <div class={style.media_section}>
        <Suspense fallback={<div>Loading...</div>}>
          <For each={gotoPage}>
            {(page, index) => (
              <A href={`/collection/${page}`}>
                <span>{page}</span>
                <span>{index()}</span>
              </A>
            )}
          </For>
        </Suspense>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
};

export default OverView;
