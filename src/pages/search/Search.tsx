import styles from "./Search.module.css";
import { A } from "@solidjs/router";
import { createMemo, createResource, createSignal, onMount, Show, For } from "solid-js";
import { fetchRefetch, fetchSearch } from "../../components/extents/request/fetching";
import { useManageURLContext } from "../../context/ManageUrl";
import { CloseIcon, SearchIcon } from "../../components/svgIcons";
// import debounce from "lodash/debounce";

const Search = () => {
  const { resetParams, updatePage } = useManageURLContext();
  const [keyword, setKeyword] = createSignal("");
  const [searchResult] = createResource(keyword, fetchSearch);

  const photos = createMemo(() => searchResult()?.data || []);
  const suggestions = createMemo(() => searchResult()?.suggestCount || []);
  const totalCount = createMemo(() => photos()[0]?.total_count || 0);

  // const debouncedSetKeyword = debounce((value) => setKeyword(value), 300);

  onMount(async () => {
    resetParams();
    await fetchRefetch();
  });

  const updateSearch = (word: string) => {
    const prevWords = keyword().trim().split(" ");
    prevWords[prevWords.length - 1] = word;
    setKeyword(prevWords.join(" ") + " ");
  };

  const debouncedSetKeyword = debounce(setKeyword, 250);

  return (
    <main class={styles.main}>
      {/* <header class={styles.header}>
        <h1>Search</h1>
      </header> */}

      <Show when={photos().length}>
        <HeaderImage image={photos()[0].thumb_path} />
      </Show>

      <div class={styles.groupSearch}>
        <input
          type="text"
          placeholder="Search photos using a sentence..."
          value={keyword()}
          onInput={(e) => debouncedSetKeyword(e.currentTarget.value)}
        />
        <Show when={keyword()}>
          <button class={styles.clearBtn} onClick={() => setKeyword("")} aria-label="Clear search input">
            {CloseIcon()}
          </button>
        </Show>
      </div>

      <Show when={searchResult.loading}>
        <div class={styles.loader}>Loading...</div>
      </Show>

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

      <Show
        when={photos().length}
        fallback={
          <div class={styles.notfound}>
            <h3>No Results Found</h3>
            <p>No matches for "{keyword()}." Try another search.</p>
          </div>
        }>
        <div class={styles.imageContainer}>
          <div class={styles.resultsHeader}>
            <h3>{totalCount()} Photos</h3>
            <A
              href={keyword() ? "/search/all" : "#"}
              classList={{ [styles.disableLink]: !keyword() || !totalCount() }}
              onClick={() => keyword() && updatePage({ searchKey: keyword() })}>
              See All
            </A>
          </div>

          <div class={styles.libraryGrid}>
            <For each={photos()}>
              {(media) => (
                <A
                  href={`/search/${media.media_id}`}
                  class={styles.imageLink}
                  onClick={() => keyword() && updatePage({ searchKey: keyword() })}>
                  <Show when={media.favorite}>
                    <div class={styles.overlayFavorite}></div>
                  </Show>
                  <p class={styles.caption}>{media.caption}</p>
                  <img src={media.thumb_path} alt={media.caption} loading="lazy" />
                </A>
              )}
            </For>
          </div>
        </div>
      </Show>
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
