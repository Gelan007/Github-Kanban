import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {GitHubIssue, GroupedIssues, GroupedIssuesWithTitles, RepositoryData} from "../../interfaces/github";
import {githubAPI} from "../../api/github";
import {
    getFinalGroupedIssues,
    getGroupedIssues,
    getGroupedIssuesWithoutTitles,
    getIssueObjectFromSessionStorageIfExists, getRepoData
} from "../utils/kanban-board-slice-utils";
import {BoardTitles} from "../../interfaces/enums";


const ISSUES = "issues";

export const getIssues = createAsyncThunk(
    'kanbanBoard/getIssues',
    async (payload:{url: string, isLoadMoreData: boolean}, {rejectWithValue}) => {
        try {
            const response = await githubAPI.getIssues(payload.url, payload.isLoadMoreData);

            if (typeof response.data !== "string") {
                const response = await githubAPI.getIssues(payload.url, payload.isLoadMoreData);
                const repoResponse = await githubAPI.getRepositoryInformation(payload.url, payload.isLoadMoreData);

                return {
                    data: response.data,
                    link: response.headers.link,
                    isLoadMoreData: payload.isLoadMoreData,
                    starsCount: repoResponse.data.stargazers_count
                };
            }
            return rejectWithValue("Incorrect URL format");
        } catch (err: any) {
            return rejectWithValue(err.response.data);
        }
    });


export type KanbanBoardInitialState = {
    isLoading: boolean
    issues: GitHubIssue[]
    groupedIssues: GroupedIssues
    sessionStorageIssues: GitHubIssue[]
    issuesHeaderLink: string
    nextPageUrl: string | null
    error: string | null
    repoData: RepositoryData
}

const initialState: KanbanBoardInitialState = {
    isLoading: false,
    sessionStorageIssues: [],
    issues: [],
    groupedIssues: {},
    issuesHeaderLink: "",
    nextPageUrl: null,
    error: null,
    repoData: {repoLink: "", ownerLink: "", repoName: "", ownerName: "", starsCount: 0}
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
        setNextPageUrl: (state, action: {payload: {headerLink: string}}) => {
            const links = action.payload.headerLink.split(', ');
            for (const link of links) {
                const [url, rel] = link.split('; ');
                const parsedUrl = url.slice(1, -1);
                const parsedRel = rel.slice(5, -1);
                if (parsedRel === 'next') {
                    state.nextPageUrl = parsedUrl;
                    break;
                }
            }
        },
        setIssueToSessionStorage: (state, action: { payload: { issue: GitHubIssue, status: BoardTitles } }) => {
            const storedIssues = state.sessionStorageIssues;
            const issueWithStatus = {...action.payload.issue, storageStatus: action.payload.status };
            const issueData =
                getIssueObjectFromSessionStorageIfExists(action.payload.issue.id, storedIssues);

            if (issueData.index === -1) {
                storedIssues.push(issueWithStatus);
            } else {
                storedIssues[issueData.index] = issueWithStatus;
            }

            sessionStorage.setItem(ISSUES, JSON.stringify(storedIssues))
        },
        updateAllGroupedIssues: (state,
                           action: { payload: { groupedIssues: GroupedIssuesWithTitles[] } }
        ) => {
            const { groupedIssues } = action.payload;

            groupedIssues.forEach((issueWithTitle) => {
                const transformedGroupedIssues = getGroupedIssuesWithoutTitles(issueWithTitle);
                state.groupedIssues = {
                    ...state.groupedIssues,
                    ...transformedGroupedIssues,
                };
            });
        },

        addGroupedIssues: (state, action:{payload: {item: GitHubIssue, title: BoardTitles}}) => {
            const {item, title} = action.payload;

            switch(title) {
                case BoardTitles.ToDo:
                    state.groupedIssues.todoIssues = state.groupedIssues.todoIssues
                        ? [...state.groupedIssues.todoIssues, item]
                        : [item];
                    break;
                case BoardTitles.InProgress:
                    state.groupedIssues.inProgressIssues = state.groupedIssues.inProgressIssues
                        ? [...state.groupedIssues.inProgressIssues, item]
                        : [item];
                    break;
                case BoardTitles.Done:
                    state.groupedIssues.doneIssues = state.groupedIssues.doneIssues
                        ? [...state.groupedIssues.doneIssues, item]
                        : [item];
                    break;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getIssues.pending, (state) => {
                state.isLoading = true;
                state.error = null;
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

                state.groupedIssues = getFinalGroupedIssues(action.payload.isLoadMoreData, updatedIssues, state.groupedIssues);
                state.sessionStorageIssues = sessionStorageIssues;
                state.issues = action.payload.isLoadMoreData ? [...state.issues, ...updatedIssues] : updatedIssues;
                state.issuesHeaderLink = action.payload.link;
                state.repoData = getRepoData(action.payload.data[0].url, action.payload.starsCount);

            })
            .addCase(getIssues.rejected, (state, action) => {
                state.isLoading = false;
                if(typeof action.payload === "string") {
                    state.error = action.payload;
                } else {
                    state.error = "Invalid request"
                }
            });
    }
})

export const {setIssues,
    addMoreIssues,
    setIssueToSessionStorage,
    updateAllGroupedIssues,
    addGroupedIssues,
    setNextPageUrl
} = kanbanBoardSlice.actions;
export default kanbanBoardSlice.reducer;