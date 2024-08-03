import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './reducers/movie';

const store = configureStore({
    reducer: {
        movies: movieReducer,
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
