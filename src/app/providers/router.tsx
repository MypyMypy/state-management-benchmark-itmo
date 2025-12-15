import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/home';
import ReduxCatalog from '@/pages/redux/S1Catalog';
import ReduxForm from '@/pages/redux/S2Form';
import ReduxStream from '@/pages/redux/S3Stream';
import MobxCatalog from '@/pages/mobx/S1Catalog';
import MobxForm from '@/pages/mobx/S2Form';
import MobxStream from '@/pages/mobx/S3Stream';
import EffectorCatalog from '@/pages/effector/S1Catalog';
import EffectorForm from '@/pages/effector/S2Form';
import EffectorStream from '@/pages/effector/S3Stream';

export const AppRouter: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/redux/catalog" element={<ReduxCatalog />} />
    <Route path="/redux/form" element={<ReduxForm />} />
    <Route path="/redux/stream" element={<ReduxStream />} />
    <Route path="/mobx/catalog" element={<MobxCatalog />} />
    <Route path="/mobx/form" element={<MobxForm />} />
    <Route path="/mobx/stream" element={<MobxStream />} />
    <Route path="/effector/catalog" element={<EffectorCatalog />} />
    <Route path="/effector/form" element={<EffectorForm />} />
    <Route path="/effector/stream" element={<EffectorStream />} />
  </Routes>
);
