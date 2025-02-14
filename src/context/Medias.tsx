import { createContext, useContext, createSignal, Accessor, Setter } from "solid-js";

interface ContextProps {
  items: Accessor<Map<number, string>>;
  setItems: Setter<Map<number, string>>;
  isSelected: Accessor<boolean>;
  setIsSelected: Setter<boolean>;
}

const GlobalMediaContext = createContext<ContextProps>();

export const MediaContextProvider = (props: any) => {
  const [items, setItems] = createSignal<Map<number, string>>(new Map());
  const [isSelected, setIsSelected] = createSignal(false);

  return (
    <GlobalMediaContext.Provider
      value={{
        items,
        setItems,
        isSelected,
        setIsSelected,
      }}>
      {props.children}
    </GlobalMediaContext.Provider>
  );
};

export const useMediaContext = () => useContext(GlobalMediaContext)!;
