import {BoardTitles, IssueState} from "./enums";
export type GitHubAssignee = {
    id: number,
    login: string,
    type: string,
    url: string
}
export type GitHubIssue = {
    assignee: GitHubAssignee | null
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

export interface GroupedIssuesWithRepoId extends GroupedIssues {
    repositoryId: string
}

export type RepositoryData = {
    repoLink: string,
    ownerLink: string,
    repoName: string,
    ownerName: string
    starsCount?: number
}
