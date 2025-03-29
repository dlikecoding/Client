import { A, useNavigate } from "@solidjs/router";
import { TestAccountIcon } from "../../svgIcons";
import { useAuthContext } from "../../../context/AuthProvider";
import { Show } from "solid-js";

const AccountButton = () => {
  const navigate = useNavigate();

  const { loggedUser } = useAuthContext();
  return (
    <>
      <button
        style={{ "background-color": true ? "rgb(51,94,168)" : "rgb(236,106,94)" }}
        popoverTarget="account-popover">
        {TestAccountIcon()}
      </button>
      <div popover="auto" id="account-popover" class="popover-container devices_filter_popover">
        <A href="/user">Profile</A>

        <Show when={loggedUser.roleType === "admin"}>
          <A href="/user/admin">Dashboard</A>
        </Show>

        <A
          href="#"
          onclick={async () => {
            const res = await fetch("api/v1/user/logout");
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
