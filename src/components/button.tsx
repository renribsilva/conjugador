import React from "react";
import styles from "../styles/components.module.css";

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, ...props }, ref) => {
    return (
      <div>
        <button 
          ref={ref} 
          className={styles.button}
          {...props}
        >
          {children}
        </button>
      </div>
    );
  }
);

Button.displayName = "Button";

export default Button;
