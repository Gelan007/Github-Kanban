import {createSlice} from "@reduxjs/toolkit";

type KanbanBoardInitialState = {
    isLoading: boolean
}

const initialState: KanbanBoardInitialState = {
    isLoading: false
}

const kanbanBoardSlice = createSlice({
    name: "kanbanBoard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {}
})


export const {} = kanbanBoardSlice.actions;
export default kanbanBoardSlice.reducer;