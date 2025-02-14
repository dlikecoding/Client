import { RecoverButtonIcon } from "../../../svgIcons";

type RecoverProps = {
  action: () => void;
  status: boolean;
};

export const Recover = (props: RecoverProps) => {
  return (
    <button onClick={props.action} disabled={props.status}>
      {RecoverButtonIcon()}
    </button>
  );
};
