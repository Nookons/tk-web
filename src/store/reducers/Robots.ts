import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { collection, onSnapshot, query, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { IRobot } from "../../types/Robot";

// Define the initial state
type ItemsState = {
    items: IRobot[];
    loading: boolean;
    error: string | undefined;
};

const initialState: ItemsState = {
    items: [],
    loading: false,
    error: undefined,
};

// Async thunk for fetching robots from Firestore
export const fetchRobots = createAsyncThunk<IRobot[], undefined, { rejectValue: string }>(
    'items/fetchRobots',
    async (_, { rejectWithValue }) => {
        try {
            const q = query(collection(db, "robots_check"));

            return new Promise<IRobot[]>((resolve, reject) => {
                const unsubscribe = onSnapshot(doc(db, "robots_check", "robot_array"), (doc) => {
                    if (doc.exists()) {
                        resolve(doc.data().array as IRobot[]);
                    } else {
                        reject("Document does not exist");
                    }
                }, (error) => {
                    reject(error.message);
                });

                // Unsubscribe from Firestore listener when promise settles
                return () => unsubscribe();
            });
        } catch (error) {
            return rejectWithValue('There was an error loading data from the server. Please try again.');
        }
    }
);

// Create the robot slice
const robotSlice = createSlice({
    name: 'robots',
    initialState,
    reducers: {
        addRobot: (state, action: PayloadAction<IRobot>) => {
            const filteredRobots = state.items.filter(item => item.robot_id !== action.payload.robot_id);
            state.items = [...filteredRobots, action.payload];
        },
        removeRobot: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(item => item.robot_id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRobots.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(fetchRobots.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchRobots.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch robots';
            });
    }
});

// Export actions
export const { addRobot, removeRobot } = robotSlice.actions;

export default robotSlice.reducer;
