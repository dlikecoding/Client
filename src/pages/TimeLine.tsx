import { A } from "@solidjs/router";

const TimeLine = () => {
  return (
    <>
      TimeLine
      <nav>
        <li>
          <A href="/library">Year</A>
        </li>
        <li>
          <A href="/library/month">Month</A>
        </li>
        <li>
          <A href="/library/view">View</A>
        </li>

        <li>
          <A href="/">Close</A>
        </li>
      </nav>
    </>
  );
};

export default TimeLine;
