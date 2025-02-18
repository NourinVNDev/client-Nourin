import { store } from './store';

export const getUserId = (): string | null => {
  const state = store.getState();
  return state.user?._id; // Adjust this based on your Redux state structure
};
