import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scrolls to the top of the window instantly
    window.scrollTo(0, 0);
  }, [pathname]); // Runs every time the route (pathname) changes

  return null;
}