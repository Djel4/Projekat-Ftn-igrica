import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import { getDropdownMenuPlacement } from 'react-bootstrap/esm/DropdownMenu';
const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

export default store;