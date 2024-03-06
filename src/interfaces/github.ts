import {BoardTitles, IssueState} from "./enums";

export type GitHubIssue = {
    assignee: any
    id: number
    title: string
    number: number
    created_at: Date
    user: {login: string, type: string}
    comments: number
    state: IssueState.Open | IssueState.Closed
    storageStatus?: BoardTitles
}

export type GroupedIssues = {
    todoIssues?: GitHubIssue[];
    inProgressIssues?: GitHubIssue[];
    doneIssues?: GitHubIssue[];
}

export interface GroupedIssuesWithTitles {
    title: BoardTitles
    items?: GitHubIssue[]
}

export type RepositoryData = {
    repoLink: string,
    ownerLink: string,
    repoName: string,
    ownerName: string
    starsCount?: number
}
