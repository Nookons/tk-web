import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { IEmployer } from "../../types/Employer";

// Define the initial state
type ItemsState = {
    items: IEmployer[];
    loading: boolean;
    error: string | undefined;
};

const initialState: ItemsState = {
    items: [],
    loading: false,
    error: undefined,
};

export const fetchEmployers = createAsyncThunk<IEmployer[], undefined, { rejectValue: string }>(
    'employers/fetchEmployers',
    async (_, { rejectWithValue }) => {
        try {
            const q = query(collection(db, "employers"));
            const querySnapshot = await getDocs(q);

            const employers: IEmployer[] = [];
            querySnapshot.forEach((doc) => {
                employers.push({
                    ...doc.data() as IEmployer
                });
            });
            return employers;
        } catch (error) {
            return rejectWithValue('There was an error loading data from the server. Please try again.');
        }
    }
);

const employersSlice = createSlice({
    name: 'employers',
    initialState,
    reducers: {
        addEmployee: (state, action: PayloadAction<IEmployer>) => {
            const filteredEmployers = state.items.filter(item => item.id !== action.payload.id);
            state.items = [...filteredEmployers, action.payload];
        },
        removeEmployee: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployers.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(fetchEmployers.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchEmployers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch employers';
            });
    }
});

export const { addEmployee, removeEmployee } = employersSlice.actions;

export default employersSlice.reducer;
