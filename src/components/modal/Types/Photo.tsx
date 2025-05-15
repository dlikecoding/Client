import { Accessor, Component, createSignal, Setter, Show } from "solid-js";
import { useManageURLContext } from "../../../context/ManageUrl";
import { MediaType, useViewMediaContext } from "../../../context/ViewContext";
import styles from "./Types.module.css";
import EditPhoto from "../Editing/EditPhoto";

interface PhotoProps {
  media: MediaType;
  isVisible: boolean;

  showImageOnly: Accessor<boolean>;
  setShowImageOnly: Setter<boolean>;
}

const Photo: Component<PhotoProps> = (props) => {
  let photoRef: HTMLImageElement;
  const { view } = useManageURLContext();
  const [imgLoading, setImgLoading] = createSignal<boolean>(true);

  const isVisible = () => props.isVisible;

  const { isEditing, setIsEditing } = useViewMediaContext();

  return (
    <>
      <img
        ref={(el) => (photoRef = el)}
        class={styles.imageTag}
        style={{ "object-fit": view.modalObjFit ? "cover" : "contain" }}
        onLoad={() => setImgLoading(false)}
        onError={() => setImgLoading(true)}
        loading="lazy"
        src={imgLoading() ? props.media.thumb_path : props.media.source_file}
        alt={`Modal Image`}
      />
      <Show when={isEditing() && isVisible()}>
        {/* {isSeeking() && <Spinner />} */}
        {photoRef! && <EditPhoto photo={photoRef} setIsEditing={setIsEditing} />}
      </Show>
    </>
  );
};
export default Photo;
