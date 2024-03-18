import {GitHubIssue, GroupedIssues, GroupedIssuesWithTitles, RepositoryData} from "../../interfaces/github";
import {BoardTitles, IssueState} from "../../interfaces/enums";

export const getIssueObjectFromSessionStorageIfExists = (issueId: number, sessionStorageIssues: GitHubIssue[]):
    { index: number, issue: GitHubIssue | null} => {
    const storedIssueIndex = sessionStorageIssues.findIndex(issue => issue.id === issueId);
    if (storedIssueIndex === -1) {
        return {index: -1, issue: null}
    }

    return {index: storedIssueIndex, issue: sessionStorageIssues[storedIssueIndex]};
}

export const getGroupedIssues = (issues: GitHubIssue[]): GroupedIssues => {
    const groupedIssues: GroupedIssues = {todoIssues: [], doneIssues: [], inProgressIssues: []};

    issues.forEach((issue) => {
        if (issue.storageStatus) {
            addToGroup(groupedIssues, issue.storageStatus, issue);
        } else {
            if (checkIsIssueTodo(issue)) {
                addToGroup(groupedIssues, BoardTitles.ToDo, issue);
            } else if (checkIsIssueInProgress(issue)) {
                addToGroup(groupedIssues, BoardTitles.InProgress, issue);
            } else if (checkIsIssueDone(issue)) {
                addToGroup(groupedIssues, BoardTitles.Done, issue);
            }
        }
    });

    return groupedIssues;
};

export const getGroupedIssuesWithoutTitles = (issues: GroupedIssuesWithTitles): GroupedIssues => {
    const groupedIssues: GroupedIssues = {}
    if(issues.title === BoardTitles.ToDo) {
        groupedIssues.todoIssues = issues.items
    }
    if(issues.title === BoardTitles.InProgress) {
        groupedIssues.inProgressIssues = issues.items
    }
    if(issues.title === BoardTitles.Done) {
        groupedIssues.doneIssues = issues.items
    }

    return groupedIssues;
}

export const getGroupedIssuesWithTitles = (groupedIssues: GroupedIssues): GroupedIssuesWithTitles[] => {
    const issues: GroupedIssuesWithTitles[] = [
        {title: BoardTitles.ToDo, items: groupedIssues.todoIssues},
        {title: BoardTitles.InProgress, items: groupedIssues.inProgressIssues},
        {title: BoardTitles.Done, items: groupedIssues.doneIssues},
    ]

    return issues;
}

export const getRepoData = (url: string, starsCount: number): RepositoryData => {
    const parts = url.split('/');

    if (parts[3] === 'repos') {
        return {
            repoLink: `https://github.com/${parts[4]}/${parts[5]}`,
            ownerLink: `https://github.com/${parts[4]}`,
            repoName: parts[5],
            ownerName: parts[4],
            starsCount
        };
    }
    return {
        repoLink: ``,
        ownerLink: ``,
        repoName: "",
        ownerName: "",
        starsCount
    };
}

export const getFinalGroupedIssues = (
    isLoadMoreData: boolean,
    serverIssues: GitHubIssue[],
    stateGroupedIssues: GroupedIssues
): GroupedIssues => {
    const groupedIssues: GroupedIssues = getGroupedIssues(serverIssues);
    let finalGroupedIssues: GroupedIssues = JSON.parse(JSON.stringify(stateGroupedIssues));

    if (isLoadMoreData) {
        Object.keys(stateGroupedIssues).forEach((key) => {
            const typedKey = key as keyof GroupedIssues;
            if (groupedIssues[typedKey]) {
                finalGroupedIssues[typedKey]!.push(...groupedIssues[typedKey]!);
            }
        })
    } else {
        finalGroupedIssues = {
            ...stateGroupedIssues,
            ...groupedIssues
        }
    }

    return finalGroupedIssues;
}

const getGroupKey = (groupTitle: BoardTitles): string => {
    switch (groupTitle) {
        case BoardTitles.ToDo:
            return "todoIssues";
        case BoardTitles.InProgress:
            return "inProgressIssues";
        case BoardTitles.Done:
            return "doneIssues";
        default:
            return "";
    }
};

const addToGroup = (groupedIssues: GroupedIssues, groupTitle: BoardTitles, issue: GitHubIssue) => {
    const groupKey = getGroupKey(groupTitle) as keyof GroupedIssues;
    groupedIssues[groupKey] = groupedIssues[groupKey] || [];
    groupedIssues[groupKey]!.push(issue);
};


const checkIsIssueTodo = (issue: GitHubIssue): boolean => !issue.assignee && issue.state === IssueState.Open
const checkIsIssueInProgress = (issue: GitHubIssue): boolean => !!issue.assignee && issue.state === IssueState.Open
const checkIsIssueDone = (issue: GitHubIssue): boolean => issue.state === IssueState.Closed