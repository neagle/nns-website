"use client";

import React, { useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import classnames from "classnames";
import { useMapAnimation } from "@/app/hooks/useMapAnimation";

const memorialHallCoords = { lat: 38.88062394130813, lng: -77.16771738621296 };

const parkingCoords: { lat: number; lng: number }[] = [
  { lat: 38.88100262726351, lng: -77.16810974821132 },
  { lat: 38.880731190756705, lng: -77.16838869794887 },
  { lat: 38.88045975321301, lng: -77.1679622267155 },
  { lat: 38.88059234014274, lng: -77.16784018620532 },
  { lat: 38.880783390165476, lng: -77.16815534576457 },
  { lat: 38.880935812219576, lng: -77.16798636659664 },
];

const COLOR_PRIMARY = "oklch(84.299% 0.1345 76.52581)";

const exclamations = [
  "We’re here!",
  "We made it!",
  "Yay!",
  "🤘",
  "Woohoo!",
  "Hooray!",
  "🔥",
  "It’s Memorial Hall!",
  "Theater HO!",
  "💃",
  "🎆",
  "🎉",
  "Just in time!",
];

const ParkingMap = () => {
  // This is useful for constructing an array of coordinates when building a
  // polyline
  // const [coordinateArray, setCoordinateArray] = useState<
  //   { lat: number; lng: number }[]
  // >([]);

  const mapRef = useRef<HTMLDivElement>(null);

  useMapAnimation((registerAnimation) => {
    if (!mapRef.current) return;

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: "weekly",
      libraries: ["places", "marker"],
    });

    loader.load().then((google) => {
      const map = new google.maps.Map(mapRef.current!, {
        mapId: "NOVANightskyMap",
        center: memorialHallCoords,
        zoom: 19,
        mapTypeId: "satellite",
        zoomControl: true,
        mapTypeControl: false,
        // Kept in case we want to add mapTypeControl back
        // mapTypeControlOptions: {
        //   style: google.maps.MapTypeControlStyle.DEFAULT,
        //   position: google.maps.ControlPosition.TOP_RIGHT,
        // },
        scaleControl: true,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: true,
      });

      const { AdvancedMarkerElement } = google.maps.marker;

      // Custom star SVG marker
      const parser = new DOMParser();
      const logoStarSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 400 400"><path d="M200,0,233.99186938124421,95.38378320753311,317.55705045849464,38.19660112501052,288.9918693812442,135.34362224782797,390.21130325903073,138.19660112501052,310,200,390.21130325903073,261.80339887498945,288.9918693812442,264.65637775217203,317.55705045849464,361.8033988749895,233.99186938124421,304.6162167924669,200,400,166.00813061875579,304.6162167924669,82.4429495415054,361.8033988749895,111.00813061875579,264.65637775217203,9.7886967409693,261.8033988749895,90,200,9.7886967409693,138.19660112501046,111.00813061875577,135.34362224782797,82.44294954150536,38.196601125010545,166.00813061875579,95.38378320753311Z" fill="hsl(37, 97.6%, 67.8%)" /></svg>`;
      const logoStar = parser.parseFromString(
        logoStarSvgString,
        "image/svg+xml"
      ).documentElement;

      new AdvancedMarkerElement({
        position: memorialHallCoords,
        map,
        content: logoStar,
        title: "Falls Church Presbyterian Church – Memorial Hall",
      });

      registerAnimation((timestamp) => {
        const scale = 1 + 0.1 * Math.sin(timestamp / 300);
        const opacity = 0.5 + 0.7 * ((Math.sin(timestamp / 300) + 1) / 2);
        logoStar.style.transform = `scale(${scale}) rotate(${
          (timestamp / 50) % 360
        }deg)`;
        logoStar.style.opacity = String(opacity);
        logoStar.style.transformOrigin = "50% 50%";
      });

      // Polygon
      new google.maps.Polygon({
        paths: parkingCoords,
        strokeColor: "#0077ff",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#0077ff",
        fillOpacity: 0.3,
        map,
        clickable: false,
      });

      // Kept in case we want to make the parking area pulse again
      // Animate polygon pulse
      // registerAnimation((timestamp) => {
      //   const t = (timestamp / 1000) % 2;
      //   const eased = 0.2 + 0.1 * Math.sin(t * Math.PI);
      //   parkingArea.setOptions({
      //     fillOpacity: eased,
      //     strokeOpacity: 0.4 + 0.4 * ((eased - 0.1) / 0.2),
      //   });
      // });

      // Custom P marker
      const parkingLabel = document.createElement("div");
      parkingLabel.className = classnames(["text-base", "-translate-x-1/2"]);
      parkingLabel.textContent = "🅿️";

      new AdvancedMarkerElement({
        position: { lat: 38.880628117268564, lng: -77.16811883746536 },
        map,
        content: parkingLabel,
      });

      // Polyline with arrow -- this shows a walking path to the entrance to
      // Memorial Hall
      const pathCoords = [
        { lat: 38.88072124420769, lng: -77.16803098464274 },
        { lat: 38.88061788925074, lng: -77.16785395884776 },
        { lat: 38.88060953732847, lng: -77.16783384228015 },
        { lat: 38.88061058131883, lng: -77.16781909013056 },
        { lat: 38.880611625309136, lng: -77.16779629135394 },
        { lat: 38.880608493338116, lng: -77.16778019809985 },
        { lat: 38.88060640535737, lng: -77.16776142263674 },
        { lat: 38.88061266929944, lng: -77.16774264717364 },
        { lat: 38.88061768220872, lng: -77.16773760218075 },
      ];

      const pathLine = new google.maps.Polyline({
        zIndex: 100000,
        path: pathCoords,
        geodesic: true,
        strokeColor: "oklch(84.299% 0.5 .52581)",
        strokeOpacity: 0.5,
        strokeWeight: 3,
        icons: [
          {
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 5,
              strokeColor: "oklch(60% 0.1345 76.52581)",
              strokeWeight: 0,
              strokeOpacity: 0.3,
              fillColor: COLOR_PRIMARY,
              fillOpacity: 1,
            },
            offset: "100%",
          },
        ],
        map,
      });

      const speechBubble = document.createElement("div");
      speechBubble.className = classnames([
        "shadow-lg",
        "text-base",
        "text-[0.6rem]",
        "bg-white",
        "text-black",
        "px-3",
        "py-1",
        "rounded-xl",
        "translate-y-full",
        "relative",
        "before:text-[0.6rem]!",
        "before:content-['▲']",
        "before:absolute",
        "before:text-white",
        "before:top-0",
        "before:left-1/2",
        "before:-translate-y-[0.2rem]",
        "before:-translate-x-1/2",
        "before:leading-[0]",
        "transition-all",
        "duration-500",
      ]);
      speechBubble.textContent =
        exclamations[Math.floor(Math.random() * exclamations.length)];

      new AdvancedMarkerElement({
        position: { lat: 38.8805466859962, lng: -77.16776790813432 },
        map,
        content: speechBubble,
      });

      // Animate arrow along path
      let prevOn = false;
      registerAnimation((timestamp) => {
        const t = (timestamp / 50) % 100;

        const zoom = map.getZoom() || 0;
        const on = t > 80 && zoom > 18;
        if (on && !prevOn) {
          const randomIndex = Math.floor(Math.random() * exclamations.length);
          const newExclamation = exclamations[randomIndex];

          speechBubble.textContent = newExclamation;
        }
        if (!on && prevOn) {
          prevOn = false;
        }
        prevOn = on;

        const opacity = on ? 1 : 0;
        // Basically, test for regular characters
        const isNotEmojiRegex = /^[^a-zA-Z0-9\s]+$/;

        let fontSize;
        if (on && isNotEmojiRegex.test(speechBubble.textContent!)) {
          // Make emojis larger
          fontSize = "1.5rem";
        } else {
          fontSize = "0.6rem";
        }
        speechBubble.style.opacity = String(opacity);
        speechBubble.style.top = on ? "0" : "10px";
        speechBubble.style.fontSize = fontSize;

        pathLine.setOptions({
          icons: [
            {
              icon: pathLine.get("icons")[0].icon,
              offset: `${t}%`,
            },
          ],
        });
      });

      const memorialHall = document.createElement("div");
      memorialHall.className = classnames([
        "text-base",
        "text-[0.6rem]",
        "text-neutral-content",
        "bg-base-100",
        "text-black",
        "px-1.5",
        "py-1",
        "rounded",
        "shadow-primary",
        "shadow-lg",
        "relative",
        "transition-all",
        "duration-500",
      ]);
      memorialHall.innerHTML =
        "<h2>Memorial Hall</h2><p>Falls Church Presbyterian Church</p>";

      new AdvancedMarkerElement({
        position: { lat: 38.880818123207796, lng: -77.16772499279008 },
        map,
        content: memorialHall,
      });

      // This is a tool for grabbing coordinates from the map for use in
      // building different markers
      // map.addListener("rightclick", (e: google.maps.MapMouseEvent) => {
      //   const coords = e.latLng?.toJSON();
      //   navigator.clipboard.writeText(JSON.stringify(coords));
      //   // This is for constructing polylines
      //   // setCoordinateArray((prev) => {
      //   //   const newArray = [...prev, coords!];
      //   //   navigator.clipboard.writeText(JSON.stringify(newArray));
      //   //   return newArray;
      //   // });
      // });
    });
  });

  return (
    <div
      className={classnames([
        "w-full",
        "h-full",
        // "min-h-[300px]",
        // "aspect-[4/3]",
        // "md:aspect-auto",
        "overflow-hidden",
      ])}
    >
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default ParkingMap;
