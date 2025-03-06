import { useMediaContext } from "../../../../context/Medias";
import { SaveButtonIcon } from "../../../svgIcons";
import { ButtonProps } from "./ButtonProps";

export const Save = (props: ButtonProps) => {
  const { items } = useMediaContext();

  return (
    <button
      onClick={() => {
        props.action;
      }}>
      {SaveButtonIcon()}
    </button>
  );
};
