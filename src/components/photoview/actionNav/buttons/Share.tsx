import { useMediaContext } from "../../../../context/Medias";
import { ShareButtonIcon } from "../../../svgIcons";
import { ButtonProps } from "./ButtonProps";

export const Share = (props: ButtonProps) => {
  const { items } = useMediaContext();

  return (
    <button
      onClick={() => {
        props.action;
      }}>
      {ShareButtonIcon()}
    </button>
  );
};
