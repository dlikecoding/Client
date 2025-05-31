import { createResource, For, onMount, Show } from "solid-js";
import style from "./OverView.module.css";
import { A } from "@solidjs/router";
import { fetchAlbum, fetchStatistic } from "../../components/extents/request/fetching";
import { useManageURLContext } from "../../context/ManageUrl";
import placeholder from "../../assets/svgs/place-holder.svg";

type UpdateKey = "Favorite" | "Hidden" | "Duplicate" | "Recently Deleted";

const OverView = () => {
  const { resetParams, updatePage } = useManageURLContext();

  const [loadedStatistics] = createResource<string, string>(fetchStatistic);
  const [loadedAlbums] = createResource(fetchAlbum);

  const gotoPage: Record<UpdateKey, { [key: string]: number }> = {
    Favorite: { favorite: 1 },
    Hidden: { hidden: 1 },
    Duplicate: { duplicate: 1 },
    "Recently Deleted": { deleted: 1 },
  };

  onMount(resetParams);

  return (
    <main class="mainHomePage">
      <header style={{ position: "relative" }}>
        <div>
          <h1>Collection</h1> {/* Portfolio */}
        </div>
      </header>

      <h3>
        My Albums
        <button class={style.atag_group_views} on:click={() => console.log("Album clicked")}>
          Edit
        </button>
      </h3>
      <div class={style.cards_section}>
        <div class={style.cards}>
          <For
            each={loadedAlbums()}
            fallback={
              <A href="#" class={style.albumCard}>
                <img loading="lazy" src={placeholder} alt="Focus Playlist" />
                <div>Create Album</div>
                {/* <p> {album.media_count}</p> */}
              </A>
            }>
            {(album, _) => (
              <A href={`/collection/album/${album.album_id}`} class={style.albumCard}>
                <img loading="lazy" src={album.thumb_path} alt="Focus Playlist" />
                <div>{album.title}</div>
                <p>{album.media_count}</p>
              </A>
            )}
          </For>
        </div>
      </div>

      {/* //////////////////////////// */}
      <h3>
        Dataset (Comming soon)
        <button class={style.atag_group_views} on:click={() => console.log("Dataset clicked")}>
          Edit
        </button>
      </h3>
      <div class={style.cards_section}>
        <div class={style.cards}>
          <A href="#" class={style.card}>
            <img loading="lazy" src={placeholder} alt="Focus Playlist" />

            <div class={style.cardFooter}>
              <div>Placeholder</div>
              <p>999</p>
            </div>
          </A>

          {/* <For each={loadedAlbums()}>
            {(album, _) => (
              <A href={`/collection/dataset/${album.album_id}`} class={style.card}>
                <img loading="lazy" src={album.thumb_path} alt="Focus Playlist" />

                <div class={style.cardFooter}>
                  <div>{album.title}</div>
                  <p>{album.media_count}</p>
                </div>
              </A>
            )}
          </For> */}
        </div>
      </div>
      {/* //////////////////////////// */}

      <Show when={loadedStatistics()}>
        <h3>Utilities</h3>
        <div class={style.media_section}>
          <For each={Object.entries(loadedStatistics()!)}>
            {([key, value]) => (
              <A
                href={parseInt(value) === 0 ? "#" : `/collection/${Object.keys(gotoPage[key as UpdateKey])[0]}`}
                onClick={() => {
                  if (parseInt(value) === 0) return;

                  const updateData = gotoPage[key as UpdateKey];
                  if (updateData) return updatePage(updateData);
                  console.warn(`No update action found for: ${key}`);
                }}>
                <span>{key}</span>
                <span>{value}</span>
              </A>
            )}
          </For>
        </div>
      </Show>
      <div style={{ height: "100px" }}></div>
    </main>
  );
};

export default OverView;
