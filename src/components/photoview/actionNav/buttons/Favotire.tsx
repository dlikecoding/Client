import { FavoriteButtonIcon } from "../../../svgIcons";
import { ButtonProps } from "./ButtonProps";

export const Favorite = (props: ButtonProps) => <button onClick={props.action}>{FavoriteButtonIcon()}</button>;
