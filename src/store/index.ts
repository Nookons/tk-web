import { configureStore } from '@reduxjs/toolkit';
import robotsReducer from './reducers/Robots';

const store = configureStore({
    reducer: {
        robots: robotsReducer,
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
