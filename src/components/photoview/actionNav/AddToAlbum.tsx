import styles from "./AddToAlbum.module.css";

import { createResource, createSignal, For, Setter } from "solid-js";
import { useMediaContext } from "../../../context/Medias";
import { fetchAlbum, fetchAlbumUpdating } from "../../extents/request/fetching";
import { ZoomInIcon } from "../../svgIcons";
import { Portal } from "solid-js/web";

interface AddToAlbumProps {
  setAddToAlbum: Setter<boolean>;
}

const AddToAlbum = (props: AddToAlbumProps) => {
  const { items, setIsSelected } = useMediaContext();

  const [loadedAlbums, { mutate, refetch }] = createResource(fetchAlbum);

  // Handle click save when input is null
  const [inputValue, setInputValue] = createSignal("");

  const addMediasToAlbum = async (albumId?: number, albumTitle?: string) => {
    const listOfIds = Array.from(items().values());
    const result = await fetchAlbumUpdating(listOfIds, albumId, albumTitle);
    if (result.ok) {
      props.setAddToAlbum(false);
      setIsSelected(false);
      return true;
    }
    alert("can not add elements to album");
    return false;
  };

  return (
    <Portal>
      <div class={styles.albumAddContainer}>
        <div class={styles.header}>
          <button
            on:click={() => {
              props.setAddToAlbum(false);
            }}>
            Cancel
          </button>
          <h4>Add to Album</h4>
          <button
            on:click={() => {
              document.querySelector("dialog")!.showModal();
            }}>
            {ZoomInIcon()}
          </button>
        </div>

        <dialog id="dialogContainer" class={styles.dialogContainer}>
          <div class={styles.dialogHeader}>
            <div class={styles.dialogTitle}>New Album</div>
            <div class={styles.dialogSubtitle}>Enter a name for this album.</div>
          </div>

          <div class={styles.inputContainer}>
            <input
              type="text"
              placeholder="Title"
              value={inputValue()}
              on:input={(e) => setInputValue(e.target.value)}
            />
          </div>

          <div class={styles.dialogButtons}>
            <button
              class={styles.cancelBtn}
              on:click={() => {
                setInputValue("");
                document.querySelector("dialog")!.close();
              }}>
              Cancel
            </button>
            <button
              class={styles.saveBtn}
              on:click={async () => {
                await addMediasToAlbum(undefined, inputValue());
              }}
              disabled={!inputValue().trim()}>
              Create
            </button>
          </div>
        </dialog>

        <h4>Albums</h4>
        <div class={styles.listOfAlbums}>
          <For each={loadedAlbums() ?? []}>
            {(album) => (
              <div
                on:click={async () => {
                  await addMediasToAlbum(album.album_id);
                }}>
                <img src={album.ThumbPath} alt={album.title} />
                <div>{album.title}</div>
                <text>{album.media_count}</text>
              </div>
            )}
          </For>
        </div>
      </div>
    </Portal>
  );
};

export default AddToAlbum;
