import styles from "./Search.module.css";
import { A } from "@solidjs/router";
import { createMemo, createResource, createSignal, onMount, Show, For } from "solid-js";
import { fetchRefetch, fetchSearch } from "../../components/extents/request/fetching";
import { useManageURLContext } from "../../context/ManageUrl";
import { CloseIcon, SearchIcon } from "../../components/svgIcons";

const DELAY_ON_INPUT = 250; //ms

const Search = () => {
  const { resetParams, updatePage } = useManageURLContext();
  const [keyword, setKeyword] = createSignal("");
  const [searchResult] = createResource(keyword, fetchSearch);

  const photos = createMemo(() => searchResult()?.data || []);
  const suggestions = createMemo(() => searchResult()?.suggestCount || []);
  const totalCount = createMemo(() => photos()[0]?.total_count || 0);

  onMount(async () => {
    resetParams();
    await fetchRefetch();
  });

  const updateSearch = (word: string) => {
    const prevWords = keyword().trim().split(" ");
    prevWords[prevWords.length - 1] = word;
    setKeyword(prevWords.join(" ") + " ");
  };

  const debouncedSetKeyword = debounce(setKeyword, DELAY_ON_INPUT);

  const setClick = () => keyword() && updatePage({ searchKey: keyword() });
  return (
    <main class={`mainHomePage ${styles.searchMain}`}>
      <h1 class={styles.header}>Search</h1>
      <Show when={photos().length}>
        <HeaderImage image={photos()[0].thumb_path} />
      </Show>

      <div class={styles.groupSearch}>
        <input
          type="text"
          placeholder="Cup of coffee on a wooden table..."
          value={keyword()}
          onInput={(e) => debouncedSetKeyword(e.currentTarget.value)}
        />
        <Show when={keyword()}>
          <button class={styles.clearBtn} onClick={() => setKeyword("")} aria-label="Clear search input">
            {CloseIcon()}
          </button>
        </Show>
      </div>

      <div class={styles.searchResult}>
        <For each={suggestions()}>
          {(each) => (
            <button
              class={styles.suggestionBtn}
              onClick={() => updateSearch(each.word)}
              aria-label={`Suggestion: ${each.word}`}>
              <span>{each.word}</span>
              <span>{each.ndoc}</span>
            </button>
          )}
        </For>
      </div>

      <Show when={searchResult.error}>
        <div class={styles.error}>An error occurred: {searchResult.error.message}</div>
      </Show>

      <div class={styles.imageContainer}>
        <Show
          when={photos().length}
          fallback={
            <div class={styles.notfound}>
              <h3 style={{ border: "none" }}>No Results Found</h3>
              <p>No matches for "{keyword()}." Try another search.</p>
            </div>
          }>
          <div class={styles.resultsHeader}>
            <h3>{totalCount()} Photos</h3>
            <A
              href={keyword() ? `/search/${keyword()}` : "#"}
              classList={{ [styles.disableLink]: !keyword() || !totalCount() }}
              onClick={setClick}>
              See All
            </A>
          </div>

          <div class={styles.libraryGrid}>
            <For each={photos()}>
              {(media) => (
                <A
                  href={keyword() ? `/search/${keyword()}/${media.media_id}` : "#"}
                  // `/search/all/${media.media_id}`
                  classList={{ [styles.imageLink]: true, [styles.disableLink]: !keyword() }}
                  onClick={setClick}>
                  <Show when={media.favorite}>
                    <div class={styles.overlayFavorite}></div>
                  </Show>
                  {/* <p class={styles.caption}>{media.caption}</p> */}
                  <img src={media.thumb_path} alt={media.caption} loading="lazy" />
                </A>
              )}
            </For>
          </div>
        </Show>
      </div>
    </main>
  );
};

const HeaderImage = (props: { image: string }) => (
  <div class={styles.headerImage}>
    <img inert src={props.image} alt="Blurred background" />
    <img inert src={props.image} alt="Main visual" />
  </div>
);

export default Search;

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>;

  return ((...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}
