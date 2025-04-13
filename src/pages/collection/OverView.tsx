import { createResource, For, Suspense } from "solid-js";
import style from "./OverView.module.css";
import { A } from "@solidjs/router";
import { fetchAlbum, fetchStatistic } from "../../components/extents/request/fetching";
import { useManageURLContext } from "../../context/ManageUrl";

type UpdateKey = "Favorite" | "Hidden" | "Duplicate" | "Recently Deleted";

const OverView = () => {
  const { updatePage } = useManageURLContext();

  const [loadedStatistics, { mutate: statsMutate, refetch: statsRefetch }] = createResource<string, string>(
    fetchStatistic
  );
  const [loadedAlbums, { mutate: albumMutate, refetch: albumRefetch }] = createResource(fetchAlbum);

  const gotoPage: Record<UpdateKey, { [key: string]: number }> = {
    Favorite: { favorite: 1 },
    Hidden: { hidden: 1 },
    Duplicate: { duplicate: 1 },
    "Recently Deleted": { deleted: 1 },
  };

  return (
    <>
      <header style={{ position: "relative", "z-index": 1 }}>
        <div>
          <h1>Collection</h1> {/* Portfolio */}
        </div>
      </header>

      <h3>
        My Albums
        <button class={style.atag_group_views}>Edit</button>
      </h3>
      <div class={style.album_section}>
        <div class={style.cards}>
          <For each={loadedAlbums()}>
            {(album, _) => (
              <A href={`/collection/album/${album.album_id}`} class={style.albumCard}>
                <img src={album.thumb_path} alt="Focus Playlist" />
                <div> {album.title}</div>
                <p>{album.media_count}</p>
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
          <For each={loadedAlbums()}>
            {(album, _) => (
              <A href={`/collection/dataset/${album.album_id}`} class={style.card}>
                <img src={album.thumb_path} alt="Focus Playlist" />

                <div class={style.cardFooter}>
                  <div> {album.title}</div>
                  <p>{album.media_count}</p>
                </div>
              </A>
            )}
          </For>
        </div>
      </div>
      {/* //////////////////////////// */}

      <h3>Utilities</h3>
      <div class={style.media_section}>
        <For each={Object.entries(loadedStatistics() || {})} fallback={<div>Not Found...</div>}>
          {([key, value]) => (
            <A
              href={`/collection/${Object.keys(gotoPage[key as UpdateKey])[0]}`}
              onClick={() => {
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
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
};

export default OverView;
