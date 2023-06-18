export type SearchResult = {
    startAt: number
    maxResults: number
    total: number
    issues: any[]
}

export type Issue = {
    jira_id: string
    project: Project
    type: ISSUE_TYPE
    link: string
    browserLink: string
    key: string
    points: number | null
    status: string
}

export type EpicMilestone = {
    jira_id: string
    link: string
    browserLink: string
    key: string
    pointsToDo: number
    pointsInProgress: number
    pointsDone: number
    pointsTotal: number
}

export enum ISSUE_TYPE {
    EPIC = 'Epic',
    FEATURE = 'Feature'
}

export type Project = {
    id: string
    name: string
}

export enum PointType {
    actionable = 'Actionable',
    blocked = 'Blocked',
    completed = 'Completed',
    total = 'Total'
}

export enum MetricGroup {
    backlogHealth = 'backlog_health'
}
