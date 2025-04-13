import styles from "./AddToCollection.module.css";
import { createResource, createSignal, For, Setter } from "solid-js";
import { useMediaContext } from "../../../../context/Medias";
import { ZoomInIcon } from "../../../svgIcons";
import { Portal } from "solid-js/web";

interface AddToCollectionProps {
  setAddToCollection: Setter<boolean>;
  entityType: "Album" | "Dataset";
  fetchItems: () => Promise<any[] | undefined>;
  updateItems: (ids: string[], entityId?: number, entityTitle?: string) => Promise<{ ok: boolean }>;
}

const AddToCollection = (props: AddToCollectionProps) => {
  const { items, setIsSelected } = useMediaContext();

  const [loadedEntities, { mutate, refetch }] = createResource(props.fetchItems);

  const [inputValue, setInputValue] = createSignal("");

  const addItemsToCollection = async (entityId?: number, entityTitle?: string) => {
    const listOfIds = Array.from(items().values());
    const result = await props.updateItems(listOfIds, entityId, entityTitle);
    if (result.ok) {
      props.setAddToCollection(false);
      setIsSelected(false);
      return true;
    }
    alert(`Cannot add elements to ${props.entityType.toLowerCase()}`);
    return false;
  };

  return (
    <Portal>
      <div class={styles.albumAddContainer}>
        <div class={styles.header}>
          <button onClick={() => props.setAddToCollection(false)}>Cancel</button>
          <h4>Add to {props.entityType}</h4>
          <button
            onClick={() => {
              const dialog = document.getElementById("dialogCollectionContainer") as HTMLDialogElement;
              if (dialog) dialog.showModal();
            }}>
            {ZoomInIcon()}
          </button>
        </div>

        <dialog id="dialogCollectionContainer" class={styles.dialogContainer}>
          <div class={styles.dialogHeader}>
            <div class={styles.dialogTitle}>New {props.entityType}</div>
            <div class={styles.dialogSubtitle}>Enter a name for this {props.entityType.toLowerCase()}.</div>
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
              onClick={() => {
                setInputValue("");
                const dialog = document.getElementById("dialogCollectionContainer") as HTMLDialogElement;
                if (dialog) dialog.close();
              }}>
              Cancel
            </button>
            <button
              class={styles.saveBtn}
              onClick={async () => {
                await addItemsToCollection(undefined, inputValue());
              }}
              disabled={!inputValue().trim()}>
              Create
            </button>
          </div>
        </dialog>

        <h4>{props.entityType}s</h4>
        <div class={styles.listOfAlbums}>
          <For each={loadedEntities()}>
            {(entity) => (
              <div
                onClick={async () => {
                  await addItemsToCollection(entity[props.entityType === "Album" ? "album_id" : "class_id"]);
                }}>
                <img src={entity.thumb_path} alt={entity.title} />
                <div>{entity.title}</div>
                <text>{entity.media_count}</text>
              </div>
            )}
          </For>
        </div>
      </div>
    </Portal>
  );
};

export default AddToCollection;
