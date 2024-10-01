import { createSlice } from "@reduxjs/toolkit";

// Khởi tạo trạng thái ban đầu
const initialState = {
    updatedValue: null, // Giá trị cập nhật ngẫu nhiên
};

const roomSlice = createSlice({
    name: 'room', // Đổi tên thành 'room'
    initialState, // Sử dụng initialState
    reducers: {
        updateRooms: (state, action) => {
            state.updatedValue = action.payload; // Cập nhật giá trị random
        },
    },
});

// Xuất các action và reducer
export const { updateRooms } = roomSlice.actions;
export default roomReducer = roomSlice.reducer; // Xuất reducer
