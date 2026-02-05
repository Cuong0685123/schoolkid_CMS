'use client';

import clsx from "clsx";
import styles from "./styles.module.scss";

export default function index({ children, type, onClick, mode }) {
    return (
        <button type={type} onClick={onClick} className={clsx(mode === 'add' ? styles.add : styles.delete)}>
            {children}
        </button>
    );
}
