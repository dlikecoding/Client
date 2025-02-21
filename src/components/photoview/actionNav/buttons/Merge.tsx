import { MergeButtonIcon } from "../../../svgIcons";
import { ButtonProps } from "./ButtonProps";

export const Merge = (props: ButtonProps) => {
  return <button onClick={props.action}>{MergeButtonIcon()}</button>;
};
