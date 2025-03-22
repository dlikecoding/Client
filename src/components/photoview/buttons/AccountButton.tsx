import { A, useNavigate } from "@solidjs/router";
import { TestAccountIcon } from "../../svgIcons";

const AccountButton = () => {
  const navigate = useNavigate();
  return (
    <>
      <button
        style={{ "background-color": true ? "rgb(51,94,168)" : "rgb(236,106,94)" }}
        popoverTarget="account-popover">
        {TestAccountIcon()}
      </button>
      <div popover="auto" id="account-popover" class="popover-container devices_filter_popover">
        <A href="/user">Profile</A>
        <A href="">More</A>
        <A href="/user/admin">Dashboard</A>
        <A href="/login">Login</A>
        <A
          href="#"
          onclick={async () => {
            const res = await fetch("api/v1/auth/logout");
            if (!res.ok) console.log(res);
            navigate("/login");
          }}>
          Logout
        </A>
      </div>
    </>
  );
};

export default AccountButton;
