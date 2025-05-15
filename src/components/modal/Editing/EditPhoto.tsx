import { Component, Setter } from "solid-js";
import LayoutEditing from "./LayoutEditing";

type EditPhotoProps = {
  photo: HTMLImageElement;
  setIsEditing: Setter<boolean>;
};

const EditPhoto: Component<EditPhotoProps> = (props) => {
  const handleCancel = () => props.setIsEditing(false);
  const handleDone = () => {
    // photo save logic
    props.setIsEditing(false);
  };

  return (
    <LayoutEditing onCancel={handleCancel} onDone={handleDone}>
      {/* Media-specific logic/UI */}
      <div style={{ color: "white" }}></div>
    </LayoutEditing>
  );
};

export default EditPhoto;
