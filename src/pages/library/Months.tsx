import styles from "./Group.module.css";
import { A } from "@solidjs/router";
import { GroupMedia } from "./GroupView";
import { useManageURLContext } from "../../context/ManageUrl";
import { onMount } from "solid-js";

type TypeMonths = {
  photo: GroupMedia;
};

export const Months = (props: TypeMonths) => {
  const photo = () => props.photo;

  const { params, updatePage } = useManageURLContext();
  let target: HTMLAnchorElement | undefined = undefined;

  onMount(() => {
    requestAnimationFrame(() => {
      if (!params.year || !params.month || !target) return;
      target.scrollIntoView({ behavior: "instant", block: "center" });
    });
  });

  const formatDate = formatDateParts(photo().create_date);
  return (
    <A
      ref={(el) => {
        if (photo().create_year === params.year && photo().create_month === params.month) target = el;
      }}
      class={styles.monthViewContainer}
      onClick={() => updatePage({ year: photo().create_year, month: photo().create_month })}
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
};

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
