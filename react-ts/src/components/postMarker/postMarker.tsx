import * as React from "react";
import pinIcon from "../../resources/fire-512.webp";
import { Marker, Popup, useMap } from "react-leaflet";
import { Icon, Point, LatLng, Popup as PopupType } from "leaflet";
import { useEffect, useRef } from "react";

interface PostMarkerProps {
  position: LatLng;
  children?: React.ReactNode;
  open?: boolean;
}

export function PostMarker(props: PostMarkerProps) {
  const userIcon = new Icon({
    iconUrl: pinIcon,
    iconSize: new Point(40, 40),
  });
  const popupRef = useRef<PopupType | null>(null);
  const map = useMap();

  useEffect(() => {
    if (props.open) {
      popupRef.current?.setLatLng(props.position).openOn(map);
    } else {
      popupRef.current?.closePopup();
    }
  }, [map, popupRef, props.open, props.position]);

  return (
    <Marker position={props.position} icon={userIcon}>
      <Popup
        ref={popupRef}
      >
        {props.children}
      </Popup>
    </Marker>
  );
}
