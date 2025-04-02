import { For, Show } from "solid-js";

import { SortAscIcon, SortDescIcon, ZoomInIcon, ZoomOutIcon } from "../svgIcons";
import { useManageURLContext } from "../../context/ManageUrl";

const MIN_NUMBER_OF_COLUMNS = 2;
const MAX_NUMBER_OF_COLUMNS = 7; // Zoom out maximum n columns

const FilterTimeline = () => {
  const { view, params, setView, updatePage, updatePageKey } = useManageURLContext();

  const filterOptions = [
    { label: "Photo", className: "photos" },
    { label: "Live", className: "lives" },
    { label: "Video", className: "videos" },
  ];

  const updateFilter = (type: string = "") => {
    updatePageKey("filterType", type);
  };

  const toggleSort = (type: string) => {
    updatePage({ sortKey: type, sortOrder: 1 - (params.sortOrder! | 0) });
  };
  const sortOptions = [
    { type: "FileSize", label: "Size" },
    { type: "CreateDate", label: "Created" },
    { type: "UploadAt", label: "Uploaded" },
  ];

  // Handlers for UI interactions
  const handleZoom = (input: number) => {
    setView("nColumn", (prev: number) => prev + input);
  };

  return (
    <div popover="auto" id="filter-timeline" class="popover-container filter_timeline">
      <div class="media_type_contents">
        <button onClick={() => handleZoom(-1)} disabled={view.nColumn === MIN_NUMBER_OF_COLUMNS}>
          {ZoomInIcon()}
        </button>
        <span>Zoom </span>
        <button onClick={() => handleZoom(1)} disabled={view.nColumn === MAX_NUMBER_OF_COLUMNS}>
          {ZoomOutIcon()}
        </button>
      </div>
      <div onClick={() => setView("objectFit", (prev: boolean) => !prev)}>
        {view.objectFit ? "Aspect Ratio Grid" : "Square Photo Grid"}
      </div>

      <div
        style={{ "font-size": "smaller", "text-decoration": "underline", border: "none", padding: "10px 0 5px 15px" }}
        onClick={() => updateFilter()}>
        Clear Filter
      </div>

      <div class="media_type_contents">
        <For each={filterOptions}>
          {({ className, label }) => (
            <button
              class={`icon_type ${className} ${params.filterType === label ? "iconActiveFilter" : ""}`}
              onClick={() => updateFilter(label)}></button>
          )}
        </For>
      </div>

      <For each={sortOptions}>
        {({ type, label }) => (
          <div class={`sort_filter ${params.sortKey === type ? "activeFilter" : ""}`} onClick={() => toggleSort(type)}>
            <span>Sort by {label}</span>
            <Show when={params.sortKey === type}>
              <span>{params.sortOrder === 0 ? SortAscIcon() : SortDescIcon()}</span>
            </Show>
          </div>
        )}
      </For>
    </div>
  );
};

export default FilterTimeline;
