import { RecoverButtonIcon } from "../../../svgIcons";
import { ButtonProps } from "./ButtonProps";

export const Recover = (props: ButtonProps) => {
  return <button onClick={props.action}>{RecoverButtonIcon()}</button>;
};
