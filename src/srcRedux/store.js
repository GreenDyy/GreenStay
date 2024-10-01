import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import invoiceReducer from "./reducers/invoiceReducer";
import customerReducer from "./reducers/customerReducer";
import roomReducer from "./reducers/roomReducer";
import contractReducer from "./reducers/contractReducer";

const store = configureStore({
    reducer: {
        authReducer,
        invoiceReducer,
        contractReducer,
        customerReducer,
        roomReducer,
    }
})

export default store