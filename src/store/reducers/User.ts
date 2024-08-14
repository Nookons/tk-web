import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {IEmployer} from "../../types/Employer";

type ItemsState = {
    status: boolean;
    user: IEmployer | null;
    error: string | undefined;
    user_id: number;
};

const initialState: ItemsState = {
    status: false,
    user: null,
    error: undefined,
    user_id: 0,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userEnter: (state, action: PayloadAction<IEmployer>) => {
            state.status = true;
            state.user_id = action.payload.id;
            state.user = action.payload;
        },
        userLeave: (state) => {
            state.status = false;
            state.user_id = 0;
        },
        // If needed, you can add an error action as well
        setError: (state, action: PayloadAction<string | undefined>) => {
            state.error = action.payload;
        }
    },
});

export const { userEnter, userLeave, setError } = userSlice.actions;

export default userSlice.reducer;
