import { UnHiddenIcon } from "../../../svgIcons";

type UnhideProps = {
  action: () => void;
  status: boolean;
};

export const Unhide = (props: UnhideProps) => {
  return (
    <button onClick={props.action} disabled={props.status}>
      {UnHiddenIcon()}
    </button>
  );
};
