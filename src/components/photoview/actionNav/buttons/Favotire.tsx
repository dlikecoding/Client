import { useMediaContext } from "../../../../context/Medias";
import { FavoriteButtonIcon } from "../../../svgIcons";
import { ButtonProps } from "./ButtonProps";

export const Favorite = (props: ButtonProps) => {
  const { items } = useMediaContext();

  return <button onClick={props.action}>{FavoriteButtonIcon()}</button>;
};
