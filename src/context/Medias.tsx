import { createContext, useContext, createSignal, Accessor, Setter } from "solid-js";

interface ContextProps {
  items: Accessor<Map<number, string>>;
  setItems: Setter<Map<number, string>>;
  isSelected: Accessor<boolean>;
  setIsSelected: Setter<boolean>;
}

const GlobalContext = createContext<ContextProps>();

export function MediaContext(props: any) {
  const [items, setItems] = createSignal<Map<number, string>>(new Map());
  const [isSelected, setIsSelected] = createSignal(false);

  return (
    <GlobalContext.Provider
      value={{
        items,
        setItems,
        isSelected,
        setIsSelected,
      }}>
      {props.children}
    </GlobalContext.Provider>
  );
}

export const useMediaContext = () => useContext(GlobalContext)!;
