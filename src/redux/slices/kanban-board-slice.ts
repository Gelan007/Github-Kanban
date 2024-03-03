import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {GitHubIssue} from "../../interfaces/github";
import {githubAPI} from "../../api/github";
import {getIssueObjectFromSessionStorageIfExists} from "./kanban-board-utils";

const ISSUES = "issues";
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
    sessionStorageIssues: GitHubIssue[]
    issuesHeaderLink: string
}

const initialState: KanbanBoardInitialState = {
    isLoading: false,
    sessionStorageIssues: [],
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
        setIssueToSessionStorage: (state, action:{payload:{issue: GitHubIssue}}) => {
            const storedIssues = state.sessionStorageIssues;
            const issueData =
                getIssueObjectFromSessionStorageIfExists(action.payload.issue.id, state.sessionStorageIssues);

            if (issueData.index === -1) {
                storedIssues.push(action.payload.issue);
            } else {
                storedIssues[issueData.index] = action.payload.issue;
            }

            sessionStorage.setItem(ISSUES, JSON.stringify(storedIssues))
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getIssues.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getIssues.fulfilled, (state, action) => {
                state.isLoading = false;
                const sessionStorageIssues: GitHubIssue[] = JSON.parse(sessionStorage.getItem(ISSUES) || "[]");

                const updatedIssues = Array.isArray(action.payload.data) &&
                    (action.payload.data.map((serverIssue: GitHubIssue) => {
                    const sessionIssueData =
                        getIssueObjectFromSessionStorageIfExists(serverIssue.id, sessionStorageIssues);
                    return sessionIssueData.issue || serverIssue;
                })) || [];

                state.sessionStorageIssues = sessionStorageIssues;
                state.issues = action.payload.isLoadMoreData ? [...state.issues, ...updatedIssues] : updatedIssues;
                state.issuesHeaderLink = action.payload.link;
            })
    }
})

export const {setIssues, addMoreIssues, setIssueToSessionStorage} = kanbanBoardSlice.actions;
export default kanbanBoardSlice.reducer;