import { createContext, useContext, createSignal, Accessor, Setter } from "solid-js";

interface ContextProps {
  items: Accessor<Map<number, string>>;
  setItems: Setter<Map<number, string>>;
  setOneItem: (key: number, value: string) => void;

  isSelected: Accessor<boolean>;
  setIsSelected: Setter<boolean>;
}

const GlobalMediaContext = createContext<ContextProps>();

export const MediaContextProvider = (props: any) => {
  // store index (number) and media id (string) in the map.
  const [items, setItems] = createSignal<Map<number, string>>(new Map());
  const [isSelected, setIsSelected] = createSignal(false);

  const setOneItem = (key: number, value: string): void => {
    setItems(new Map([[key, value]]));
  };

  return (
    <GlobalMediaContext.Provider
      value={{
        items,
        setOneItem,
        setItems,

        isSelected,
        setIsSelected,
      }}>
      {props.children}
    </GlobalMediaContext.Provider>
  );
};

export const useMediaContext = () => useContext(GlobalMediaContext)!;
