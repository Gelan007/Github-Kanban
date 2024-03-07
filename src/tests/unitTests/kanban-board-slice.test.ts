import kanbanBoardReducer, {
    getIssues,
    setIssues,
    addMoreIssues,
    setNextPageUrl,
    setIssueToSessionStorage,
    updateAllGroupedIssues,
    addGroupedIssues, KanbanBoardInitialState,
} from '../../redux/slices/kanban-board-slice';
import {BoardTitles, IssueState} from "../../interfaces/enums";


describe('Kanban Board Reducers', () => {
    const sampleIssue = {
        assignee: null,
        id: 1,
        title: 'Issue 1',
        number: 25,
        created_at: new Date(),
        user: { login: 'facebook', type: 'User' },
        comments: 0,
        state: IssueState.Open,
    };

    const initialState: KanbanBoardInitialState = {
        isLoading: false,
        sessionStorageIssues: [],
        issues: [],
        groupedIssues: {},
        issuesHeaderLink: '',
        nextPageUrl: null,
        error: null,
        repoData: { repoLink: '', ownerLink: '', repoName: '', ownerName: '', starsCount: 0 },
    };

    it('should set issues with "setIssues" action', () => {
        const issues = [sampleIssue];
        const action = setIssues(issues);
        const result = kanbanBoardReducer(initialState, action);
        expect(result.issues).toEqual(issues);
    });

    it('should add issues with "addMoreIssues" action', () => {
        const moreIssues = [
            {
                assignee: null,
                id: 2,
                title: 'Issue 2',
                number: 26,
                created_at: new Date(),
                user: { login: 'github', type: 'User' },
                comments: 0,
                state: IssueState.Open,
            },
        ];
        const action = addMoreIssues(moreIssues);
        const result = kanbanBoardReducer({ ...initialState, issues: [sampleIssue] }, action);
        expect(result.issues).toEqual([sampleIssue, ...moreIssues]);
    });

    it('should set next page URL with "setNextPageUrl" action', () => {
        const headerLink = '<https://api.github.com/repos/facebook/react/issues?page=2>; rel="next"';
        const action = setNextPageUrl({ headerLink });
        const result = kanbanBoardReducer(initialState, action);
        expect(result.nextPageUrl).toEqual('https://api.github.com/repos/facebook/react/issues?page=2');
    });

    it('should set issue to sessionStorage with "setIssueToSessionStorage" action', () => {
        const status = BoardTitles.InProgress;
        const action = setIssueToSessionStorage({ issue: sampleIssue, status });
        const result = kanbanBoardReducer({ ...initialState, sessionStorageIssues: [] }, action);
        expect(result.sessionStorageIssues).toEqual([{ ...sampleIssue, storageStatus: status }]);
    });

    it('should update all grouped issues with "updateAllGroupedIssues" action', () => {
        const groupedIssues = [
            {
                title: BoardTitles.ToDo,
                items: [sampleIssue],
            },
        ];
        const action = updateAllGroupedIssues({ groupedIssues });
        const result = kanbanBoardReducer({ ...initialState, groupedIssues: {} }, action);
        expect(result.groupedIssues).toEqual({ todoIssues: [sampleIssue] });
    });

    it('should add groupedIssue to appropriate category with "addGroupedIssues" action', () => {
        const title = BoardTitles.ToDo;
        const action = addGroupedIssues({ item: sampleIssue, title });
        const result = kanbanBoardReducer({ ...initialState, groupedIssues: { todoIssues: [] } }, action);
        expect(result.groupedIssues).toEqual({ todoIssues: [sampleIssue] });
    });
});























/*
import kanbanBoardReducer, {
    getIssues,
    setIssues,
    addMoreIssues,
    setNextPageUrl,
    setIssueToSessionStorage,
    updateAllGroupedIssues,
    addGroupedIssues, KanbanBoardInitialState,
} from '../../redux/slices/kanban-board-slice';

import {configureStore} from "@reduxjs/toolkit";
import {AppRootStateType} from "../../redux/store";
import {BoardTitles, IssueState} from "../../interfaces/enums";

//const mockStore = configureStore(middlewares);

// Мокаем функции из API и добавляем их в объект
/!*jest.mock('../../api/github', () => ({
    githubAPI: {
        getIssues: jest.fn(),
        getRepositoryInformation: jest.fn(),
    },
}));*!/

// Мокаем sessionStorage
/!*const sessionStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => (store[key] = value),
        clear: () => (store = {}),
    };
})();
Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
});*!/

describe('kanban board slice', () => {
    /!*let store: AppRootStateType;

    beforeEach(() => {
        store = mockStore({
            kanbanBoard: {
                isLoading: false,
                sessionStorageIssues: [],
                issues: [],
                groupedIssues: {},
                issuesHeaderLink: '',
                nextPageUrl: null,
                error: null,
                repoData: { repoLink: '', ownerLink: '', repoName: '', ownerName: '', starsCount: 0 },
            },
        });
    });*!/

    it('should create an action to set issues', () => {
        const issues = [{ id: 1, title: 'Task 1' }];
        const expectedAction = { type: setIssues.type, payload: issues };
        expect(setIssues(issues)).toEqual(expectedAction);
    });
    it('should add issues with "setIssues" action', () => {
        const initialState: KanbanBoardInitialState = {
            isLoading: false,
            sessionStorageIssues: [],
            issues: [],
            groupedIssues: {},
            issuesHeaderLink: '',
            nextPageUrl: null,
            error: null,
            repoData: { repoLink: '', ownerLink: '', repoName: '', ownerName: '', starsCount: 0 },
        };
        const issues = [{
            assignee: null,
            id: 1,
            title: "Issue title",
            number: 25,
            created_at: new Date(),
            user: {login: "facebook", type: "User"},
            comments: 0,
            state: IssueState.Open
        }];
        const action = { type: setIssues.type, payload: issues };

        const result = kanbanBoardReducer(initialState, action);
        expect(result.issues.length).toBe(1);
        expect(result.issues[0].id).toBe(1);
    });

    /!*it('should create an action to add more issues', () => {
        const issues = [{ id: 1, title: 'Task 1' }];
        const expectedAction = { type: 'kanbanBoard/addMoreIssues', payload: issues };
        expect(addMoreIssues(issues)).toEqual(expectedAction);
    });

    it('should create an action to set the URL of the next page', () => {
        const headerLink = '<https://api.github.com/repos/octocat/Hello-World/issues?page=2>; rel="next"';
        const expectedAction = { type: 'kanbanBoard/setNextPageUrl', payload: { headerLink } };
        expect(setNextPageUrl({ headerLink })).toEqual(expectedAction);
    });

    it('should create an action to save an issue to sessionStorage', () => {
        const issue = { id: 1, title: 'Task 1' };
        const status = 'ToDo';
        const expectedAction = { type: 'kanbanBoard/setIssueToSessionStorage', payload: { issue, status } };
        expect(setIssueToSessionStorage({ issue, status })).toEqual(expectedAction);
    });

    it('should create an action to update grouped issues', () => {
        const groupedIssues = [{ title: 'ToDo', items: [{ id: 1, title: 'Task 1' }] }];
        const expectedAction = { type: 'kanbanBoard/updateAllGroupedIssues', payload: { groupedIssues } };
        expect(updateAllGroupedIssues({ groupedIssues })).toEqual(expectedAction);
    });

    it('should create an action to add an issue to a group', () => {
        const item = { id: 1, title: 'Task 1' };
        const title = 'ToDo';
        const expectedAction = { type: 'kanbanBoard/addGroupedIssues', payload: { item, title } };
        expect(addGroupedIssues({ item, title })).toEqual(expectedAction);
    });*!/

    /!*it('должен создавать асинхронный Thunk для получения задач', async () => {
        const url = 'https://api.github.com/repos/octocat/Hello-World/issues';
        const isLoadMoreData = false;

        // Заменяем реализацию getIssues из мокнутого API
        require('../../api/github').githubAPI.getIssues.mockResolvedValue({
            data: [{ id: 1, title: 'Задача 1' }],
            headers: { link: '' },
            isLoadMoreData,
            starsCount: 0,
        });

        const expectedActions = [
            { type: getIssues.pending.type },
            {
                type: getIssues.fulfilled.type,
                payload: {
                    data: [{ id: 1, title: 'Задача 1' }],
                    link: '',
                    isLoadMoreData,
                    starsCount: 0,
                },
            },
        ];

        await store.dispatch(getIssues({ url, isLoadMoreData }));
        expect(store.getActions()).toEqual(expectedActions);
    });*!/
});
*/
