import React from "react";
import styles from "./styles.module.css";

type ButtonProps = {
  children: React.ReactNode;
} & React.ComponentProps<"button">;

function DefaultButton({ children, className, ...props }: ButtonProps) {
  return (
    <button className={`${styles.btn} ${className ?? ''}`} {...props}>
      {children}
    </button>
  );
}

export default DefaultButton;
