import { useTheme } from "next-themes";
import styles from "../styles/components.module.css";

function Theme() {
  
  const { resolvedTheme, setTheme } = useTheme();

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
