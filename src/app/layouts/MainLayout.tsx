import React from 'react';
import styles from '@/app/layouts/MainLayout.module.css';
import { Navigation } from '@/widgets/navigation';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.layout}>
    <Navigation />
    <div className={styles.content}>{children}</div>
  </div>
);
