import { ReactNode,  useState } from "react";
import { createGenericContext } from "./GenericContext";
export interface StoreProps {
  children: ReactNode;
}

export interface IStore {
  distanceRange: number;
  setDistanceRange: React.Dispatch<React.SetStateAction<number>>;
}

const [useStore, StoreContextProvider] = createGenericContext<IStore>();

const Store = (props: StoreProps) => {
  const [distanceRange, setDistanceRange] = useState(2500);
  const value: IStore = {
    distanceRange,
    setDistanceRange,
  };

  return (
    <StoreContextProvider value={value}>{props.children}</StoreContextProvider>
  );
};

export { useStore, Store };
