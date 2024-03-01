export type GitHubIssue = {
    assignee: any
    id: number
    title: string
    number: number
    created_at: Date
    user: {login: string, type: string}
    comments: number
    state: "open" | "closed"
}

