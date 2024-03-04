import {IssueState} from "./enums";

export type GitHubIssue = {
    assignee: any
    id: number
    title: string
    number: number
    created_at: Date
    user: {login: string, type: string}
    comments: number
    state: IssueState.Open | IssueState.Closed
}

export type GroupedIssues = {
    todoIssues?: GitHubIssue[];
    inProgressIssues?: GitHubIssue[];
    doneIssues?: GitHubIssue[];
}

export interface GroupedIssuesWithTitles {
    title: string
    items?: GitHubIssue[]
}
