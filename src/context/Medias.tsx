import { createContext, useContext, createSignal, Accessor, Setter } from "solid-js";

interface ContextProps {
  items: Accessor<Map<number, number>>;
  setItems: Setter<Map<number, number>>;
  setOneItem: (key: number, value: number) => void;

  isSelected: Accessor<boolean>;
  setIsSelected: Setter<boolean>;
}

const GlobalMediaContext = createContext<ContextProps>();

export const MediaContextProvider = (props: any) => {
  // store index (number) and media id (number) in the map.
  const [items, setItems] = createSignal<Map<number, number>>(new Map());
  const [isSelected, setIsSelected] = createSignal(false);

  const setOneItem = (key: number, value: number): void => {
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
