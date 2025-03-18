"use client";

import React, { useEffect, useRef } from "react";
import classnames from "classnames";

interface ICoordinates {
  x: number;
  y: number;
}

interface IFireFly {
  parent: SVGElement;
  initialPosition: ICoordinates;
}

/*** UTILS ***/

// Create an SVG name-spaced element
const XMLNS = "http://www.w3.org/2000/svg";

function namespaced<T extends keyof SVGElementTagNameMap>(
  tag: T,
  className?: string,
  attributes?: { [s: string]: string | number }
): SVGElementTagNameMap[T] {
  const elem = document.createElementNS(XMLNS, tag) as SVGElementTagNameMap[T];

  if (className) {
    const classNames = className.split(" ");
    classNames.forEach((n) => {
      elem.classList.add(n);
    });
  }

  if (attributes) {
    for (const [key, value] of Object.entries(attributes)) {
      elem.setAttributeNS(null, key, String(value));
    }
  }
  return elem;
}

const easing = {
  // acceleration until halfway, then deceleration
  easeInOutQuad: (t: number) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
};

/** END UTILS **/

class Firefly {
  public elem: SVGGElement;
  public parent: SVGElement;
  public flightPath: SVGPathElement;

  private animationFrameRequest: number = 0;
  private anchor: ICoordinates;

  constructor({ parent, initialPosition }: IFireFly) {
    this.parent = parent;

    this.elem = namespaced("g", "firefly transition-opacity duration-1000", {
      fill: "url(#glow)",
    });

    this.elem.appendChild(
      namespaced("circle", "body", {
        cx: 0,
        cy: 0,
        r: 10,
      })
    );

    parent.appendChild(this.elem);

    this.placeAt(initialPosition);
  }

  public placeAt(position: ICoordinates): void {
    const originalPosition = this.getOriginalPosition();

    const offset = {
      x: position.x - originalPosition.x,
      y: position.y - originalPosition.y,
    };

    this.positionOffset = offset;

    this.elem.style.transform = `translate(
      ${offset.x.toFixed(2)}px,
      ${offset.y.toFixed(2)}px
    )`;
  }

  public startFlying = () => {
    this.fly()
      .then(this.startFlying)
      .catch((error) => console.log(`%c ${error} `, "color: green"));
    this.phase();
  };

  public fly(
    destination?: ICoordinates,
    // Move the firefly at slightly randomized speeds
    duration: number = (Math.floor(Math.random() * 3) + 1) * 1000
  ) {
    return new Promise((resolve) => {
      // Interrupt the fly if it's already flying somewhere
      cancelAnimationFrame(this.animationFrameRequest);

      const startingPosition = this.getPosition();
      const anchor = this.anchor || startingPosition;

      if (!destination) {
        destination = this.pickRandomDestination(startingPosition);
      }

      const distance = {
        x: Math.abs(destination.x - startingPosition.x),
        y: Math.abs(destination.y - startingPosition.y),
      };

      // This anchor pulls the flight path in a curve
      const newAnchor: ICoordinates = {
        x: Math.floor(Math.random() * distance.x) + startingPosition.x,
        y: Math.floor(Math.random() * distance.y) + startingPosition.y,
      };

      const flightPath = this.getFlightPath();
      flightPath.setAttributeNS(null, "fill", "transparent");

      flightPath.setAttributeNS(
        null,
        "d",
        `
        M ${startingPosition.x} ${startingPosition.y}
        C ${anchor.x} ${anchor.y}, ${newAnchor.x} ${newAnchor.y}, ${destination.x} ${destination.y} 
        `
      );

      this.anchor = newAnchor;

      const pathLength = flightPath.getTotalLength();

      let startTime: number;
      const step = (timeStamp = new Date().getTime()) => {
        const runTime = timeStamp - startTime;

        let progress = runTime / duration;
        progress = easing.easeInOutQuad(Math.min(progress, 1));

        const position = flightPath.getPointAtLength(pathLength * progress);

        this.placeAt(position);

        if (runTime < duration) {
          this.animationFrameRequest = requestAnimationFrame(step);
        } else {
          resolve(null);
        }
      };

      this.animationFrameRequest = requestAnimationFrame((timeStamp) => {
        startTime = timeStamp || new Date().getTime();
        step(timeStamp);
      });
    });
  }

  public getPosition(): ICoordinates {
    const { x, y } = this.getOriginalPosition();

    return { x: x + this.positionOffset.x, y: y + this.positionOffset.y };
  }

  public phase() {
    const PHASE_DURATION = 5000;
    const OFF = "opacity-0";
    const ON = "opacity-100";

    if (this.elem.classList.contains(OFF)) {
      this.elem.classList.remove(OFF);
      this.elem.classList.add(ON);
    } else {
      this.elem.classList.remove(ON);
      this.elem.classList.add(OFF);
    }

    const nextPhase = Math.random() * PHASE_DURATION;
    setTimeout(() => this.phase, nextPhase);
  }

  private getOriginalPosition(): ICoordinates {
    const { width, height, x, y } = this.elem.getBBox();
    return { x: x + width / 2, y: y + height / 2 };
  }

  private pickRandomDestination(startingPosition: ICoordinates): ICoordinates {
    // const svg = this.elem.closest("svg");
    const svg = this.parent;
    const { width, height } = svg.getBoundingClientRect();

    const range = 100;

    const moveX = Math.floor(Math.random() * range) - range / 2;
    const moveY = Math.floor(Math.random() * range) - range / 2;

    let x = startingPosition.x + moveX;
    let y = startingPosition.y + moveY;

    const BUFFER = 10;
    if (x > width - BUFFER || y > height - BUFFER || x < BUFFER || y < BUFFER) {
      x = startingPosition.x;
      y = startingPosition.y;
    }

    return { x, y };
  }

  private getFlightPath(): SVGPathElement {
    if (!this.flightPath) {
      this.flightPath = namespaced("path");
    }

    const parent = this.elem.parentNode;

    if (!parent) {
      throw new Error("No parent to which to attach our flight path!");
    }

    if (parent) {
      parent.appendChild(this.flightPath);
    }

    return this.flightPath;
  }
}

type Props = {
  num?: number;
};

const Fireflies = ({ num = 3 }: Props) => {
  const containerSVG = useRef<SVGElement>(null);

  useEffect(() => {
    if (!containerSVG.current) return;

    // console.log("creating fireflies", num);
    const fireflies: Firefly[] = [];

    for (let i = 0; i < num; i += 1) {
      const BUFFER = 10;
      const x =
        Math.random() * (containerSVG.current.clientWidth - BUFFER * 2) +
        BUFFER;
      const y =
        Math.random() * (containerSVG.current.clientHeight - BUFFER * 2) +
        BUFFER;

      fireflies.push(
        new Firefly({
          parent: containerSVG.current,
          initialPosition: { x, y },
        })
      );
    }

    // console.log("starting fireflies", fireflies);

    fireflies.forEach((firefly) => firefly.startFlying());

    return () => {
      // cleanup
      fireflies.forEach((firefly) => {
        firefly.elem.remove();
      });
    };
  }, [num]);

  return (
    <svg
      ref={containerSVG}
      id="fireflies"
      className={classnames([
        "pointer-events-none",
        "absolute",
        "top-0",
        "left-0",
        "w-full",
        "h-[110%]",
      ])}
    >
      <defs>
        <radialGradient id="glow">
          <stop offset="0%" stopColor="hsla(50, 100%, 50%, 1)" />
          <stop offset="50%" stopColor="hsla(50, 100%, 50%, 0.2)" />
          <stop offset="100%" stopColor="hsla(50, 100%, 50%, 0)" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default Fireflies;
