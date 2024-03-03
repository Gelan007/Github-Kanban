import {GitHubIssue} from "../../interfaces/github";

export type GroupedIssues = {
    todoIssues?: GitHubIssue[];
    inProgressIssues?: GitHubIssue[];
    doneIssues?: GitHubIssue[];
}


export const getIssueObjectFromSessionStorageIfExists = (issueId: number, sessionStorageIssues: GitHubIssue[]):
    { index: number, issue: GitHubIssue | null} => {
    const storedIssueIndex = sessionStorageIssues.findIndex(issue => issue.id === issueId);
    if (storedIssueIndex === -1) {
        return {index: -1, issue: null}
    }

    return {index: storedIssueIndex, issue: sessionStorageIssues[storedIssueIndex]};
}

export const getGroupedIssues = (issues: GitHubIssue[]): GroupedIssues => {
    const groupedIssues: GroupedIssues = {};

    issues.forEach(issue => {
        if (checkIsIssueTodo(issue)) {
            if (!groupedIssues.todoIssues) {
                groupedIssues.todoIssues = [];
            }
            groupedIssues.todoIssues.push(issue);
        } else if (checkIsIssueInProgress(issue)) {
            if (!groupedIssues.inProgressIssues) {
                groupedIssues.inProgressIssues = [];
            }
            groupedIssues.inProgressIssues.push(issue);
        } else if (checkIsIssueDone(issue)) {
            if (!groupedIssues.doneIssues) {
                groupedIssues.doneIssues = [];
            }
            groupedIssues.doneIssues.push(issue);
        }
    });

    return groupedIssues;
};

const checkIsIssueTodo = (issue: GitHubIssue): boolean => !issue.assignee && issue.state === "open"
const checkIsIssueInProgress = (issue: GitHubIssue): boolean => issue.assignee && issue.state === "open"
const checkIsIssueDone = (issue: GitHubIssue): boolean => issue.state === "closed"