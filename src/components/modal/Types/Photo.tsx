import { Accessor, Component, createSignal, Setter, Show } from "solid-js";
import { useManageURLContext } from "../../../context/ManageUrl";
import { MediaType, useViewMediaContext } from "../../../context/ViewContext";
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
  const { isEditing, setIsEditing } = useViewMediaContext();

  // Tracking image onload -> load thumbnail, when done -> load original
  const [imgLoading, setImgLoading] = createSignal<boolean>(true);

  const isVisible = () => props.isVisible;

  return (
    <>
      <img
        inert
        // class={styles.imageTag}
        ref={(el) => (photoRef = el)}
        style={{
          // "min-height": "100%",
          "object-fit": view.modalObjFit ? "cover" : "contain",
        }}
        onLoad={() => setImgLoading(false)}
        onError={() => setImgLoading(true)}
        loading="lazy"
        src={imgLoading() ? props.media.thumb_path : props.media.source_file}
        alt={`Modal Image`}
      />
      <Show when={isEditing() && isVisible()}>
        {photoRef! && <EditPhoto photo={photoRef} setIsEditing={setIsEditing} />}
      </Show>
    </>
  );
};
export default Photo;
