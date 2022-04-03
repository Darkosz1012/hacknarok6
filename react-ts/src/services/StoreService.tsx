import { ApolloError, gql, useQuery, ApolloQueryResult } from "@apollo/client";
import { LatLng } from "leaflet";
import React, { ReactNode,  useEffect,  useState } from "react";
import { createGenericContext } from "./GenericContext";
export interface StoreProps {
  children: ReactNode;
}

export interface IStore {
  distanceRange: number;
  setDistanceRange: React.Dispatch<React.SetStateAction<number>>;
  position: LatLng | undefined;
  setPosition: React.Dispatch<React.SetStateAction<LatLng | undefined>>;
  placeQueryResult: {
    loading: boolean,
    error?: ApolloError | undefined,
    data: IPlaceQueryData,  
    refetch: (variables?: Partial<any>) => Promise<any>
  },
  placeQueryData: IPlaceQueryData,
}

interface IPlaceQueryData {
  places: {
    name: string,
    coords: {
      longitude: number,
      lattitude: number,
    }
  }[],
  posts: {
    title: string,
    content: string,
    createdBy: {
      username: string,
      userId: string,
    },
    createdAt: string,
    coords: {
      longitude: number,
      lattitude: number,
    },
    tags: {
      name: string,
    }[]
  }[]
}

const GET_PLACES = gql`
  query Places($where: PlaceWhere, $where2: PostWhere, $options: PlaceOptions) {
    places(where: $where, options: $options) {
      name
      coords {
        longitude
        latitude
      }
    }

    posts(where: $where2) {
      title
      content
      createdBy {
        username
        userId
      }
      createdAt
      coords {
        longitude
        latitude
      }
      tags {
        name
      }
    }
  }
`;

const [useStore, StoreContextProvider] = createGenericContext<IStore>();

const Store = (props: StoreProps) => {
  const [distanceRange, setDistanceRange] = useState(2500);
  const [position, setPosition] = useState<LatLng | undefined>();

  const placeQueryResult = useQuery(GET_PLACES, {
    variables: {
      where: {
        coords_LTE: {
          point: {
            longitude: position?.lng ?? 0,
            latitude: position?.lat  ?? 0,
          },
          distance: position?.lng ? distanceRange : 0,
        },
      },
      where2: {
        coords_LTE: {
          point: {
            longitude: position?.lng ?? 0,
            latitude: position?.lat ?? 0,
          },
          distance: position?.lng ? distanceRange : 0,
        },
      },
    },
    pollInterval: 2000,
  });

  const [placeQueryData, setPlaceQueryData] = useState<IPlaceQueryData>(placeQueryResult.data);

  useEffect(() => {
    if (placeQueryResult.loading) return;
    setPlaceQueryData(placeQueryResult.data);
  }, [placeQueryResult.loading])

  const value: IStore = {
    distanceRange,
    setDistanceRange,
    position,
    setPosition,
    placeQueryResult,
    placeQueryData,
  };

  return (
    <StoreContextProvider value={value}>{props.children}</StoreContextProvider>
  );
};

export { useStore, Store };
