import { MergeButtonIcon } from "../../../svgIcons";
import { ButtonProps } from "../ActionNav";

export const Merge = (props: ButtonProps) => {
  return <button onClick={props.action}>{MergeButtonIcon()}</button>;
};
