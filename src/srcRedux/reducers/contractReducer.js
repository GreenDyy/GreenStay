import { createSlice } from "@reduxjs/toolkit";

// Khởi tạo trạng thái ban đầu
const initialState = {
    contractData: null, // Có thể khởi tạo với giá trị null hoặc một giá trị mặc định
};

const contractSlice = createSlice({
    name: 'contract', // Đổi tên thành 'contract'
    initialState, // Sử dụng initialState
    reducers: {
        updateContracts: (state, action) => {
            state.contractData = action.payload; // Cập nhật dữ liệu hợp đồng
        },
    },
});

// Xuất các action và reducer
export const { updateContracts } = contractSlice.actions;
export default contractReducer = contractSlice.reducer; // Xuất reducer
