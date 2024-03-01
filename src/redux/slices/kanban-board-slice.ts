import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {GitHubIssue} from "../../interfaces/github";
import {githubAPI} from "../../api/github";


export const getIssues = createAsyncThunk(
    'kanbanBoard/getIssues',
    async (payload:{url: string, isLoadMoreData: boolean}, {dispatch}) => {

    const response = await githubAPI.getIssues(payload.url, payload.isLoadMoreData)
    if (response.status >= 200 && response.status <= 300) {
        return {data: response.data, link: response.headers.link, isLoadMoreData: payload.isLoadMoreData};
    } else {
        throw new Error('Failed to fetch issues');
    }
});



type KanbanBoardInitialState = {
    isLoading: boolean
    issues: GitHubIssue[]
    issuesHeaderLink: string
}

const initialState: KanbanBoardInitialState = {
    isLoading: false,
    issues: [],
    issuesHeaderLink: ""
}

const kanbanBoardSlice = createSlice({
    name: "kanbanBoard",
    initialState,
    reducers: {
        setIssues: (state, action) => {
            state.issues = action.payload
        },
        addMoreIssues: (state, action) => {
            state.issues = [...state.issues, ...action.payload]
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getIssues.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getIssues.fulfilled, (state, action) => {
                state.isLoading = false;

                const issues = Array.isArray(action.payload.data) && (action.payload.isLoadMoreData
                    ? [...state.issues, ...action.payload.data]
                    : action.payload.data) || [];

                state.issues = issues;
                state.issuesHeaderLink = action.payload.link;
            })
    }
})


export const {setIssues, addMoreIssues} = kanbanBoardSlice.actions;
export default kanbanBoardSlice.reducer;