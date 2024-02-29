import {configureStore} from "@reduxjs/toolkit";
import kanbanBoardSlice from "./slices/kanban-board-slice";

export const store = configureStore({
    reducer: {
        kanbanBoard: kanbanBoardSlice
    },
    devTools: true
})

type StoreType = typeof store;
export type AppRootStateType = ReturnType<StoreType['getState']>;