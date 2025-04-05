import { useState, useEffect } from "react";

const useResponsive = () => {
  const [isMediumUp, setIsMediumUp] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMediumUp(window.matchMedia("(min-width: 768px)").matches);
    };

    // Set initial value
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMediumUp;
};

export default useResponsive;
