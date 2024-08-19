import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { collection, onSnapshot, query, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { IRobot } from "../../types/Robot";

type ItemsState = {
    items: IRobot[];
    loading: boolean;
    error: string | undefined;
    isLoaded: boolean; // New flag to track if the robots are loaded
};

const initialState: ItemsState = {
    items: [],
    loading: false,
    error: undefined,
    isLoaded: false, // Initially, robots are not loaded
};

// Thunk to fetch robots and set up real-time listener
export const fetchAndSubscribeRobots = createAsyncThunk<IRobot[], undefined, { rejectValue: string }>(
    'items/fetchAndSubscribeRobots',
    async (_, { rejectWithValue, getState, dispatch }) => {
        const state = getState() as { robots: ItemsState };

        if (state.robots.isLoaded) {
            return state.robots.items;
        }

        try {
            return new Promise<IRobot[]>((resolve, reject) => {
                const q = query(collection(db, "robots"));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const robots: IRobot[] = [];
                    querySnapshot.forEach((doc) => {
                        robots.push(doc.data() as IRobot);
                    });

                    if (!state.robots.isLoaded) {
                        resolve(robots);
                        dispatch(setIsLoaded()); // Set the flag indicating robots are loaded
                    } else {
                        robots.forEach(robot => {
                            dispatch(updateRobot(robot));
                        });
                    }
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
        updateRobot: (state, action: PayloadAction<IRobot>) => {
            const index = state.items.findIndex(item => item.robot_id === action.payload.robot_id);
            if (index !== -1) {
                state.items[index] = action.payload; // Update the robot
            }
        },
        setIsLoaded: (state) => {
            state.isLoaded = true; // Set the loaded flag
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAndSubscribeRobots.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(fetchAndSubscribeRobots.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchAndSubscribeRobots.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch robots';
            });
    }
});

// Export actions
export const { addRobot, removeRobot, updateRobot, setIsLoaded } = robotSlice.actions;

export default robotSlice.reducer;
