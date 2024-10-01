import { createSlice } from "@reduxjs/toolkit";

const initialState = {

}

const invoiceSlice = createSlice({
    name: 'invoice',
    initialState: {
        invoiceData: initialState
    },
    reducers: {
        updateInvoices: (state, action) => {
            state.invoiceData = action.payload
        },
    }
})

export const { updateInvoices } = invoiceSlice.actions;
export default invoiceReducer = invoiceSlice.reducer;