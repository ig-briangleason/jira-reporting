import { Project } from "."

export const BROWSER_LINK_PREFIX = 'https://gambyt.atlassian.net/browse/'

export const projects: Project[] = [{
    id: 'ML',
    name: 'Loyalty'
}, {
    id: 'SCG',
    name: 'Second Chance Game'
}]
export const JIRA_BASE_URL = 'https://gambyt.atlassian.net'
export const SEARCH_API_PATH = '/rest/api/3/search'

export const WORK_NOT_COMPLETE_STATUSES = ['Needs Approval', 'Needs Estimation', 'NEEDS GROOMING', 'In Progress', 'Ready', 'Backlog']

export const JQL = (project: string) => {
    return {
        getActionablePoints: `project in (${project}) AND status in (Ready) order by created DESC`,
        getBlockedPoints: `project in (${project}) AND status in (Blocked, "Needs Approval", "Needs Estimation", "NEEDS GROOMING") order by created DESC`,
        getCompletedPoints: `project in (${project}) AND status in (Accepted, Done, "In Develop", QA, "QA Pass", RC, UAT, "UAT Pass") order by created DESC`,
        getTotalPoints: `project in (${project}) order by created DESC`,
        getAllOpenEpics: `project in (${project}) AND issuetype = Epic AND status in (Backlog, "In Progress", Ready) order by created DESC`
    }
}

//"script:jira-report": "ts-node -r tsconfig-paths/register utilities/scripts/jira-reporting/jira-report-status.ts",



