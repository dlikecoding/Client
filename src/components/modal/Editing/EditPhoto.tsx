import { Component, Setter } from "solid-js";
import LayoutEditing from "./LayoutEditing";
import Dropdown from "./options.tsx/Dropdown";
import BrusherDrawing from "./eraser/Brusher";

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
    <LayoutEditing onCancel={handleCancel} onDone={handleDone} dropdown={Dropdown()}>
      <BrusherDrawing photo={props.photo} />
    </LayoutEditing>
  );
};

export default EditPhoto;
