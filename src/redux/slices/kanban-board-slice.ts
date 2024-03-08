import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
    GitHubIssue,
    GroupedIssues,
    GroupedIssuesWithRepoId,
    GroupedIssuesWithTitles,
    RepositoryData
} from "../../interfaces/github";
import {githubAPI} from "../../api/github";
import {
    formAndGetRepositoryId,
    getGroupedIssues,
    getGroupedIssuesWithoutTitles, getGroupKey,
    getRepoData
} from "../utils/kanban-board-slice-utils";
import {BoardTitles} from "../../interfaces/enums";


const ISSUES = "issues";

export const getIssues = createAsyncThunk(
    'kanbanBoard/getIssues',
    async (payload:{url: string, isLoadMoreData: boolean}, {rejectWithValue, dispatch}) => {
        try {
            const response = await githubAPI.getIssues(payload.url, payload.isLoadMoreData)

            if (typeof response.data !== "string") {
                const response = await githubAPI.getIssues(payload.url, payload.isLoadMoreData)
                const repoResponse = await githubAPI.getRepositoryInformation(payload.url, payload.isLoadMoreData)
                return {
                    data: response.data,
                    link: response.headers.link,
                    isLoadMoreData: payload.isLoadMoreData,
                    starsCount: repoResponse.data.stargazers_count
                };
            }
            return rejectWithValue("Incorrect URL format")
        } catch (err: any) {
            return rejectWithValue(err.response.data)
        }
    });


export type KanbanBoardInitialState = {
    isLoading: boolean
    issues: GitHubIssue[]
    groupedIssues: GroupedIssues
    sessionStorageIssues: GroupedIssuesWithRepoId | null
    issuesHeaderLink: string
    nextPageUrl: string | null
    error: string | null
    repoData: RepositoryData
}

const initialState: KanbanBoardInitialState = {
    isLoading: false,
    sessionStorageIssues: null,
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
        changeIssueOrderInSessionStorage: (state, action: { payload: {
                currentBoardItems:GitHubIssue[],
                currentBoardTitle: BoardTitles,
                boardItems: GitHubIssue[],
                boardTitle: BoardTitles
        } }) => {
            const {boardItems, boardTitle, currentBoardTitle, currentBoardItems} = action.payload;
            const boardKey = getGroupKey(boardTitle);
            const currentBoardKey = getGroupKey(currentBoardTitle);

            const updatedStoredIssues = {
                ...state.sessionStorageIssues,
                [currentBoardKey]: currentBoardItems,
                [boardKey]: boardItems
            }
            const unitedIssues: GitHubIssue[] = [
                ...(updatedStoredIssues.todoIssues ?? []),
                ...(updatedStoredIssues.inProgressIssues ?? []),
                ...(updatedStoredIssues.doneIssues ?? [])
            ];
            state.groupedIssues = updatedStoredIssues;
            state.issues = unitedIssues;

            sessionStorage.setItem(ISSUES, JSON.stringify(updatedStoredIssues))
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
                const repositoryData: RepositoryData = getRepoData(action.payload.data[0].url, action.payload.starsCount);
                const sessionStorageIssues: GroupedIssuesWithRepoId | null = JSON.parse(sessionStorage.getItem(ISSUES) || "null");
                const repositoryId = formAndGetRepositoryId(repositoryData.repoName, repositoryData.ownerName);
                let groupedIssues: GroupedIssues;

                if(sessionStorageIssues?.repositoryId === repositoryId && sessionStorageIssues) {
                    groupedIssues = sessionStorageIssues;
                } else {
                    groupedIssues = getGroupedIssues(action.payload.data, sessionStorageIssues);
                }

                const groupedIssuesWithRepoId = {
                    ...groupedIssues,
                    repositoryId: repositoryId
                };
                state.groupedIssues = groupedIssues;
                state.sessionStorageIssues = groupedIssuesWithRepoId;
                sessionStorage.setItem(ISSUES, JSON.stringify(groupedIssuesWithRepoId))

                const unitedIssues: GitHubIssue[] = [
                    ...(groupedIssues.todoIssues ?? []),
                    ...(groupedIssues.inProgressIssues ?? []),
                    ...(groupedIssues.doneIssues ?? [])
                ];

                state.issues = action.payload.isLoadMoreData ? [...state.issues, ...unitedIssues] : unitedIssues;
                state.issuesHeaderLink = action.payload.link;
                state.repoData = repositoryData;

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
    changeIssueOrderInSessionStorage,
    updateAllGroupedIssues,
    addGroupedIssues,
    setNextPageUrl
} = kanbanBoardSlice.actions;
export default kanbanBoardSlice.reducer;