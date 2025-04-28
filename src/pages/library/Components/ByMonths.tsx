import styles from "../Group.module.css";
import { A } from "@solidjs/router";
import { useManageURLContext } from "../../../context/ManageUrl";
import { createSignal, Index, onMount } from "solid-js";

const ByMonths = (props: any) => {
  const { params, updatePage } = useManageURLContext();
  const medias = () => props.medias;
  const [targetRef, setTargetRef] = createSignal<HTMLAnchorElement | null>(null);

  onMount(() => {
    const target = targetRef();
    if (target) setTimeout(() => target.scrollIntoView({ behavior: "instant", block: "center" }), 0);
  });
  return (
    <Index each={medias()}>
      {(photo) => {
        const formatDate = formatDateParts(photo().create_date);
        return (
          <A
            ref={(el) => {
              photo().create_year === params.year && photo().create_month === params.month
                ? setTargetRef(el)
                : undefined;
            }}
            class={styles.monthViewContainer}
            onClick={() => {
              updatePage({ year: photo().create_year, month: photo().create_month });
            }}
            href="/library/all">
            <h3 inert class={styles.titleMonthView}>
              {formatDate.month} {photo().create_year}
            </h3>

            <div inert class={styles.overlayDay}>
              {formatDate.date}
            </div>
            <img inert loading="lazy" alt="Month Photos" src={photo().thumb_path} />
          </A>
        );
      }}
    </Index>
  );
};

export default ByMonths;

const formatDateParts = (input: string): { month: string; date: number } => {
  const date = new Date(input);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  return {
    month: date.toLocaleString("en-US", { month: "long" }), // e.g. "April"
    date: date.getDate(),
  };
};
