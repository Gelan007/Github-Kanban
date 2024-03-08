import kanbanBoardReducer, {
    setIssues,
    addMoreIssues,
    setNextPageUrl,
    setIssueToSessionStorage,
    updateAllGroupedIssues,
    addGroupedIssues, KanbanBoardInitialState,
} from '../redux/slices/kanban-board-slice';
import {BoardTitles, IssueState} from "../interfaces/enums";


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

