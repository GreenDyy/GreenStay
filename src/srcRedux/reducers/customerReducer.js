import { createSlice } from "@reduxjs/toolkit";

// Khởi tạo trạng thái ban đầu
const initialState = {
    updatedValue: null, // Giá trị cập nhật ngẫu nhiên
};

const customerSlice = createSlice({
    name: 'customer',
    initialState, // Sử dụng initialState
    reducers: {
        updateCustomers: (state, action) => {
            state.updatedValue = action.payload; // Cập nhật giá trị random
        },
    },
});

export const { updateCustomers } = customerSlice.actions;
export default customerReducer = customerSlice.reducer; 
