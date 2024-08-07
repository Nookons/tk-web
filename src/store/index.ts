import { configureStore } from '@reduxjs/toolkit';
import robotsReducer from './reducers/Robots';
import employersReducer from './reducers/Employers';

const store = configureStore({
    reducer: {
        robots: robotsReducer,
        employers: employersReducer
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
