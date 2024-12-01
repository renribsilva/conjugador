import { useTheme } from "next-themes";
import styles from "../styles/components.module.css";
import React, { useEffect, useState } from "react";

function Theme() {
  
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={resolvedTheme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}
      style={{ cursor: "pointer" }}
      className={styles.theme_button}
    >
      <span className="material-symbols-outlined" aria-hidden="true">
        {resolvedTheme === "light" ? "dark_mode" : "sunny"}
      </span>
    </button>
  );
}

export default Theme;
