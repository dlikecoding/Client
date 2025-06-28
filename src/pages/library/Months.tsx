import styles from "./Group.module.css";
import { A } from "@solidjs/router";
import { onMount } from "solid-js";

import { GroupMedia } from "./GroupView";
import { useManageURLContext } from "../../context/ManageUrl";
import { numberToMonth } from "../../components/extents/helper/helper";

type TypeMonths = {
  photo: GroupMedia;
};

const Months = (props: TypeMonths) => {
  const photo = () => props.photo;

  const { params, updatePage } = useManageURLContext();
  let target: HTMLAnchorElement | undefined = undefined;

  onMount(() => {
    requestAnimationFrame(() => {
      if (!params.year || !params.month || !target) return;
      target.scrollIntoView({ behavior: "instant", block: "center" });
    });
  });

  return (
    <A
      ref={(el) => {
        if (photo().create_year === params.year && photo().create_month === params.month) target = el;
      }}
      class={styles.monthViewContainer}
      onClick={() => updatePage({ year: photo().create_year, month: photo().create_month })}
      href="/library/all">
      <h3 inert class={styles.titleMonthView}>
        {numberToMonth(photo().create_month)} {photo().create_year}
      </h3>

      {/* <div inert class={`${styles.overlayTime} ${styles.months}`}>
        {photo().create_date}
      </div> */}
      <img inert loading="lazy" alt="Month Photos" src={photo().thumb_path} />
    </A>
  );
};

export default Months;
