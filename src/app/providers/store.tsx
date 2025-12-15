import { configureStore } from '@reduxjs/toolkit';
import catalogReducer from '@/entities/catalog/redux/catalogSlice';
import formReducer from '@/entities/form/redux/formSlice';
import streamReducer from '@/entities/stream/redux/streamSlice';
import { Provider } from 'react-redux';
import React from 'react';

export const store = configureStore({
  reducer: {
    catalog: catalogReducer,
    form: formReducer,
    stream: streamReducer,
  }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const ReduxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);
