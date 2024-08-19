import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { collection, onSnapshot, query, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { IRobot } from "../../types/Robot";

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

export const fetchRobots = createAsyncThunk<IRobot[], undefined, { rejectValue: string }>(
    'items/fetchRobots',
    async (_, { rejectWithValue }) => {
        try {
            return new Promise<IRobot[]>((resolve, reject) => {
                const q = query(collection(db, "robotInspections"));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const robots: IRobot[] = [];
                    querySnapshot.forEach((doc) => {
                        robots.push(doc.data() as IRobot);
                    });
                    resolve(robots)
                });

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
        removeRobot: (state, action: PayloadAction<string>) => {
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
