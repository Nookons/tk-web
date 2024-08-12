import { configureStore } from '@reduxjs/toolkit';
import robotsReducer from './reducers/Robots';
import employersReducer from './reducers/Employers';
import userReducer from './reducers/User';

const store = configureStore({
    reducer: {
        robots: robotsReducer,
        employers: employersReducer,
        currentUser: userReducer
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
