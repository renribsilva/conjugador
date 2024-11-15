import React from 'react';
import styles from "../styles/pages.module.css";
import { InputTypes } from '../types';

export default function Input ({ A, B, C, D, E }: InputTypes) {
  return (
    <input
      ref={A}  // Referência do input
      className={styles.input}
      type="text"
      value={B.inputValue}
      onChange={(e) => C({ ...D, inputValue: e.target.value })}
      onKeyDown={E}
      placeholder="amar, escrever, colorir, ..."
      style={{ marginRight: 10, width: 300 }}
    />
  );
};
