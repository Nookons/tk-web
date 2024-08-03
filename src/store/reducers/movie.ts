import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../firebase";
import { IMovie } from "../../types/Movie";

type ItemsState = {
    items: IMovie[],
    loading: boolean,
    error: string | undefined
}

const initialState: ItemsState = {
    items: [],
    loading: false,
    error: undefined
}

export const fetchMovies = createAsyncThunk<IMovie[], undefined, { rejectValue: string }>(
    'items/fetchMovies',
    async (_, { rejectWithValue }) => {
        try {
            const q = query(collection(db, "items"));
            let array: IMovie[] = [];

            return new Promise<IMovie[]>((resolve, reject) => {
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const newArray: IMovie[] = [];
                    querySnapshot.forEach(doc => {
                        newArray.push(doc.data() as IMovie);
                    });
                    array = newArray;
                    resolve(array);
                }, (error) => {
                    reject(error.message);
                });
            });
        } catch (error) {
            return rejectWithValue('There was an error loading data from the server. Please try again.');
        }
    }
);

const movieSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        // Add synchronous actions here if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovies.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(fetchMovies.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch movies';
            });
    }
});

export default movieSlice.reducer;
