"use client";

// import react
import "react";
import Map, {
  Layer,
  LayerProps,
  LngLatBounds,
  MapRef,
  NavigationControl,
  ViewStateChangeEvent,
} from "react-map-gl/mapbox";
// If using with mapbox-gl v1:
// import Map from 'react-map-gl/mapbox-legacy';
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { addToast } from "@heroui/react";
import { MapPinnedIcon } from "lucide-react";
import mapboxgl from "mapbox-gl";

import MemoryMapMarker from "./memory-map-marker";

import { Memory, MemoryWithUploads } from "@/db/types";
import { getCenterBetweenPoints } from "@/util/geo";

interface MemoriesMapViewProps {
  memories: MemoryWithUploads[];
  selectedMemory: Memory | null;
  onMove: () => void;
}

const MoveToMemoryEaseId = "move-to-memory";

const buildingsLayer: LayerProps = {
  id: "3d-buildings",
  source: "composite",
  "source-layer": "building",
  filter: ["==", "extrude", "true"],
  type: "fill-extrusion",
  minzoom: 15,
  paint: {
    "fill-extrusion-color": "#aaa",

    // Use an 'interpolate' expression to
    // add a smooth transition effect to
    // the buildings as the user zooms in.
    "fill-extrusion-height": [
      "interpolate",
      ["linear"],
      ["zoom"],
      15,
      0,
      15.05,
      ["get", "height"],
    ],
    "fill-extrusion-base": [
      "interpolate",
      ["linear"],
      ["zoom"],
      15,
      0,
      15.05,
      ["get", "min_height"],
    ],
    "fill-extrusion-opacity": 0.6,
  },
};

export default function MemoriesMapView({
  memories,
  onMove: onMoveHandler,
  selectedMemory,
}: MemoriesMapViewProps) {
  const memoriesWithLocation = memories.filter(
    (memory) => memory.longitude && memory.latitude,
  );

  const points = memoriesWithLocation.map((memory) => [
    memory.latitude!,
    memory.longitude!,
  ]);
  const center = getCenterBetweenPoints(points);
  const mapRef = useRef<MapRef>(null);
  const mapCointainerRef = useRef<HTMLDivElement>(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [viewBounds, setViewBounds] = useState<LngLatBounds | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      const bounds = new mapboxgl.LngLatBounds();

      points.forEach((point) => {
        bounds.extend({ lat: point[0], lng: point[1] });
      });

      mapRef.current.fitBounds(bounds, {
        padding: 100,
        duration: 700,
      });
    }
  }, [memories]);

  useEffect(() => {
    if (mapRef.current && selectedMemory) {
      mapCointainerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      mapRef.current.easeTo({
        easeId: MoveToMemoryEaseId,
        center: {
          lat: selectedMemory.latitude!,
          lng: selectedMemory.longitude!,
        },
        zoom: 13,
        duration: 700,
      });
    }
  }, [selectedMemory]);

  // TODO: This cool animation only works when we render the map for the first time, which is sad
  function onLoad() {
    if (memoriesWithLocation.length === 0) {
      addToast({
        classNames: {
          icon: "fill-none",
        },
        icon: <MapPinnedIcon size={16} />,
        title: "no memories to show",
        color: "warning",
        description:
          "click anywhere on the map to add memories that are related to a location",
      });

      return;
    }

    setTimeout(() => {
      if (mapRef.current) {
        const zoom = 10;

        // animate zoom to center
        mapRef.current!.easeTo({
          zoom: zoom,
          center: { lat: center.latitude, lng: center.longitude },
          duration: 1500,
        });
        setMapZoom(zoom);
      }
    }, 300);
  }

  function onZoom(e: ViewStateChangeEvent) {
    setMapZoom(e.viewState.zoom);
    updateViewBounds();
  }

  function onMove() {
    updateViewBounds();
  }

  function onMoveEnd(e: ViewStateChangeEvent) {
    // @ts-ignore
    const easeId = e.target._easeOptions?.easeId ?? null;

    // If the movement was caused by the selecting a memory, we don't want to notify that the map moved
    if (easeId === MoveToMemoryEaseId) {
      return;
    }
    onMoveHandler();
  }

  function updateViewBounds() {
    if (mapRef.current) {
      setViewBounds(mapRef.current!.getBounds());
    }
  }

  return (
    <div
      ref={mapCointainerRef}
      className="flex flex-col w-full gap-2 justify-center h-[600px] rounded-xl overflow-hidden"
    >
      <Map
        ref={mapRef}
        reuseMaps
        initialViewState={{
          // padding: { top: 100, right: 100, bottom: 100, left: 100 },
          latitude: center.latitude,
          longitude: center.longitude,
          zoom: mapZoom,
          pitch: 30,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN}
        projection="globe"
        onLoad={onLoad}
        onMove={onMove}
        onMoveEnd={onMoveEnd}
        onZoom={onZoom}
      >
        <NavigationControl />
        <Layer {...buildingsLayer} />
        {memoriesWithLocation.map((memory, index) => (
          <MemoryMapMarker
            key={index}
            mapZoom={mapZoom}
            memory={memory}
            viewBounds={viewBounds}
          />
        ))}
      </Map>
    </div>
  );
}
