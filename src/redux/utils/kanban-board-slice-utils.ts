import {GitHubIssue, GroupedIssues, GroupedIssuesWithTitles, RepositoryData} from "../../interfaces/github";
import {BoardTitles, IssueState} from "../../interfaces/enums";

export const getGroupedIssues = (issues: GitHubIssue[], sessionStorageIssues: GroupedIssues | null): GroupedIssues => {
    const groupedIssues: GroupedIssues = {};
    console.log(sessionStorageIssues)
    issues.forEach((issue) => {
        const sessionStorageObj = getIssueObjectFromSessionStorageIfExists(issue.id, sessionStorageIssues);
        if (sessionStorageObj.issue) {
            addToGroup(groupedIssues, sessionStorageObj.category! as BoardTitles, sessionStorageObj.issue);
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

export const getIssueObjectFromSessionStorageIfExists = (issueId: number, sessionStorageIssues: GroupedIssues | null):
    { issue: GitHubIssue | null, category: BoardTitles | null } => {

    if (sessionStorageIssues) {
        //const categories: Array<keyof GroupedIssues> = ["todoIssues", "inProgressIssues", "doneIssues"];
        const categories: BoardTitles[] = [BoardTitles.ToDo, BoardTitles.InProgress, BoardTitles.Done];
        let storedIssueObj: { issue: GitHubIssue | null, category: BoardTitles | null } = { issue: null, category: null };

        for (const category of categories) {
            const issues = sessionStorageIssues[getGroupKey(category)];

            if (issues) {
                const index = findIssueIndex(issues, issueId);
                if (index !== -1) {
                    storedIssueObj = { issue: issues[index], category: category  };
                    break;
                }
            }
        }

        return storedIssueObj;
    }

    return { issue: null, category: null };
}

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

export const formAndGetRepositoryId = (repoName: string, ownerName: string ): string => `${repoName} ${ownerName}`;

export const getGroupKey = (groupTitle: BoardTitles): keyof GroupedIssues=> {
    switch (groupTitle) {
        case BoardTitles.ToDo:
            return "todoIssues";
        case BoardTitles.InProgress:
            return "inProgressIssues";
        case BoardTitles.Done:
            return "doneIssues";
    }
};

const findIssueIndex = (issues: GitHubIssue[], issueId: number): number => {
    return issues.findIndex(issue => issue.id === issueId);
}

const addToGroup = (groupedIssues: GroupedIssues, groupTitle: BoardTitles, issue: GitHubIssue) => {
    const groupKey = getGroupKey(groupTitle) as keyof GroupedIssues;
    groupedIssues[groupKey] = groupedIssues[groupKey] || [];
    groupedIssues[groupKey]!.push(issue);
};


const checkIsIssueTodo = (issue: GitHubIssue): boolean => !issue.assignee && issue.state === IssueState.Open
const checkIsIssueInProgress = (issue: GitHubIssue): boolean => !!issue.assignee && issue.state === IssueState.Open
const checkIsIssueDone = (issue: GitHubIssue): boolean => issue.state === IssueState.Closed