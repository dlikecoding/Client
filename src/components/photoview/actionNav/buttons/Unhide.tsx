import { UnHiddenIcon } from "../../../svgIcons";
import { ButtonProps } from "./ButtonProps";

export const Unhide = (props: ButtonProps) => {
  return <button onClick={props.action}>{UnHiddenIcon()}</button>;
};
