import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '@/widgets/navigation/ui/Navigation.module.css';

export const Navigation: React.FC = () => (
  <nav className={styles.nav}>
    <NavLink to="/" end>Главная</NavLink>
    <div className={styles.group}>Redux</div>
    <NavLink to="/redux/catalog">S1</NavLink>
    <NavLink to="/redux/form">S2</NavLink>
    <NavLink to="/redux/stream">S3</NavLink>
    <div className={styles.group}>MobX</div>
    <NavLink to="/mobx/catalog">S1</NavLink>
    <NavLink to="/mobx/form">S2</NavLink>
    <NavLink to="/mobx/stream">S3</NavLink>
    <div className={styles.group}>Effector</div>
    <NavLink to="/effector/catalog">S1</NavLink>
    <NavLink to="/effector/form">S2</NavLink>
    <NavLink to="/effector/stream">S3</NavLink>
  </nav>
);
