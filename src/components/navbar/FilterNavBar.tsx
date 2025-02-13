import { createSignal, For, Show } from "solid-js";

import { createStore } from "solid-js/store";
import { SortAscIcon, SortDescIcon, ZoomInIcon, ZoomOutIcon } from "../svg-icons";
import { useManageURLContext } from "../../context/ManageUrl";

const MAX_NUMBER_OF_COLUMNS = 9; // Zoom out maximum n columns

const FilterTimeline = () => {
  const { view, setView, updatePage, updatePageKey } = useManageURLContext();

  const [selectedType, setSelectedType] = createSignal("");
  const [sortData, setSortData] = createStore({ type: "CreateDate", order: 0 });

  const filterOptions = [
    { label: "Photo", className: "photos" },
    { label: "Live", className: "lives" },
    { label: "Video", className: "videos" },
  ];

  const updateFilter = (type: string = "") => {
    setSelectedType(type);
    updatePageKey("filterType", type);
  };

  const toggleSort = (type: string) => {
    setSortData("order", sortData.type === type ? 1 - sortData.order : 0); // Toggle order
    setSortData("type", type);
    updatePage({ sortKey: type, sortOrder: sortData.order });
  };
  const sortOptions = [
    { type: "FileSize", label: "Size" },
    { type: "CreateDate", label: "Created" },
    { type: "UploadAt", label: "Uploads" },
  ];

  // Handlers for UI interactions
  const handleZoom = (input: number) => {
    setView("nColumn", (prev: number) => prev + input);
  };

  const changeGrid = () => {
    setView("objectFit", (prev: boolean) => !prev);
  };

  return (
    <div popover="auto" id="filter-timeline" class="popover-container filter_timeline">
      <div class="media_type_contents">
        <button onClick={() => handleZoom(-2)} disabled={view.nColumn === 1}>
          {ZoomInIcon()}
        </button>
        <span>Zoom </span>
        <button onClick={() => handleZoom(2)} disabled={view.nColumn === MAX_NUMBER_OF_COLUMNS}>
          {ZoomOutIcon()}
        </button>
      </div>
      <div onClick={changeGrid}>Aspect Ratio Grid</div>

      <div
        style={{ "font-size": "smaller", "text-decoration": "underline", border: "none", padding: "10px 0 5px 15px" }}
        onClick={() => updateFilter()}>
        Clear Filter
      </div>

      <div class="media_type_contents">
        <For each={filterOptions}>
          {({ className, label }) => (
            <button
              class={`icon_type ${className} ${selectedType() === label ? "active_filter" : ""}`}
              onClick={() => updateFilter(label)}></button>
          )}
        </For>
      </div>

      <For each={sortOptions}>
        {({ type, label }) => (
          <div class={`sort_filter ${sortData.type === type ? "active" : ""}`} onClick={() => toggleSort(type)}>
            <span>Sort by {label}</span>
            <Show when={sortData.type === type}>
              <span>{sortData.order === 0 ? SortAscIcon() : SortDescIcon()}</span>
            </Show>
          </div>
        )}
      </For>
    </div>
  );
};

export default FilterTimeline;
