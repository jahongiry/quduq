import { configureStore } from '@reduxjs/toolkit';
import user from './user';
import wells from './wells';
import loading from './loading';
import users from './users';
import statistics from './statistics';

export const store = configureStore({
  reducer: { user, wells, loading, users, statistics }
});
