const fetch = require('node-fetch')
import { BROWSER_LINK_PREFIX, Issue, JIRA_BASE_URL, SEARCH_API_PATH, SearchResult, WORK_NOT_COMPLETE_STATUSES, jiraRequestOptions, projects } from "."

export const mapIssueResponseToType = (issue: any): Issue => {
    const project = projects.find(project => project.id === issue.fields.project.key)
    if (!project) {
        throw new Error(`Unable to find Project in Issue ${issue}`)
    }
    return {
        jira_id: issue.id,
        type: issue.fields.issuetype.name,
        project,
        link: issue.self,
        browserLink: `${BROWSER_LINK_PREFIX}${issue.key}`,
        key: issue.key,
        points: issue.fields.customfield_10026,
        status: issue.fields.status.name
    }
}

export const fetchAllIssuesByJQL = async (jql: string): Promise<Issue[]> => {
    const allIssues: Issue[] = []

    let totalResults = 1
    let startIndex = 0

    while (startIndex < totalResults) {
        const paramRecords: Record<string, string> = {
            jql: jql,
            startAt: `${startIndex}`
        }
        const queryParams = new URLSearchParams(paramRecords).toString()

        const response = await fetch(`${JIRA_BASE_URL}${SEARCH_API_PATH}?${queryParams}`, jiraRequestOptions('GET'))
        const result: SearchResult = await response.json() as SearchResult

        startIndex += result.maxResults
        totalResults = result.total

        const resultIssues = result.issues.map(mapIssueResponseToType)
        allIssues.push(...resultIssues)
    }
    return allIssues
}

export const sumPointsByJQL = async (jql: string): Promise<number> => {
    const issues = await fetchAllIssuesByJQL(jql)
    return sumPointsOfIssues(issues)
}

export const sumPointsOfIssues = (issues: Issue[]) => {
    const sumPoints = issues.reduce((sum, current, index) => {
        return sum + (current.points ?? 0)
    }, 0)

    return sumPoints
}

export const countUnestimatedIssues = (issues: Issue[]) => {
    const countIssues = issues.reduce((sum, current, index) => {
        return sum + (current.points === null ? 1 : 0)
    }, 0)

    return countIssues
}

export const countEstimatedIssues = (issues: Issue[]) => {
    const countIssues = issues.reduce((sum, current, index) => {
        return sum + (current.points === null ? 0 : 1)
    }, 0)

    return countIssues
}

export const filterIncompleteIssues = (issue: Issue) => {
    return WORK_NOT_COMPLETE_STATUSES.includes(issue.status)
}