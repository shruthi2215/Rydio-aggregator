import { useEffect } from "react";
import useUIStore from "../store/useUIStore";

const ThemeWatcher = ({ children }) => {
  const { theme } = useUIStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return children;
};

export default ThemeWatcher;

