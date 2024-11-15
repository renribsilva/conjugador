// Layout.tsx
import React from 'react';
import { InputTypes } from '../types';
import Navbar from '../components/navbar';

export default function Layout ({ children, A, B, C, D, E }: InputTypes) {
  return (
    <>
      <Navbar A={A} B={B} C={C} D={D} E={E} />
      <main>{children}</main>
    </>
  );
};
