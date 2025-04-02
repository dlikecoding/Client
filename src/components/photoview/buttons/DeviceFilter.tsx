import { createResource, createSignal, For, Show } from "solid-js";
import { useMediaContext } from "../../../context/Medias";
import { useManageURLContext } from "../../../context/ManageUrl";
import { fetchListOfDevices } from "../../extents/request/fetching";
import { CameraIcon } from "../../svgIcons";

const DeviceFilter = () => {
  const { isSelected } = useMediaContext();
  const { updatePageKey } = useManageURLContext();
  const [loadDevices, { mutate, refetch }] = createResource(fetchListOfDevices);

  const [selectedCamera, setSelectedCamera] = createSignal(null); // Track selected camera_id

  return (
    <Show when={!isSelected()}>
      <button popovertarget="devices-filter-popover">{CameraIcon()}</button>

      <div popover="auto" id="devices-filter-popover" class="popover-container devices_filter_popover">
        <span
          // style={{ position: "sticky", top: 0, "z-index": 1 }}
          class="clear_button"
          onClick={(e) => {
            e.stopPropagation();
            updatePageKey("filterDevice", undefined);
          }}>
          Clear Filter
        </span>
        <For each={loadDevices()}>
          {(item) => (
            <div
              class={selectedCamera() === item.camera_id ? "activeFilter" : ""}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCamera(item.camera_id);
                updatePageKey("filterDevice", item.camera_id);
              }}>
              {item.Model}
            </div>
          )}
        </For>
      </div>
    </Show>
  );
};

export default DeviceFilter;
