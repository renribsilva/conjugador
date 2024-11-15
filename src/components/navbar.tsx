import React from 'react';
import Link from "next/link";
import styles from "../styles/components.module.css";
import Input from "./input";
import { InputTypes } from '../types'; // Importe o tipo corretamente

export default function Navbar ({ A, B, C, D, E }: InputTypes) { 
  return (
    <section className={styles.navbar}>
      <div>
        <Input A={A} B={B} C={C} D={D} E={E} />
      </div>
      <div>
        <h1 className={styles.title}>conjugador-gules</h1>
      </div>
      <div>
        <Link href="/sobre">Sobre</Link>
      </div>
    </section>
  );
};
