import { Issue, JQL, Project, countEstimatedIssues, countUnestimatedIssues, fetchAllIssuesByJQL, filterIncompleteIssues, projects, sumPointsOfIssues } from "."

const calculateEpicData = async (epic: Issue) => {
    const childrenIssues = await fetchAllIssuesByJQL(`project in (${epic.project.id}) AND cf[10014] = ${epic.key}`)
    const remainingWork = childrenIssues.filter(filterIncompleteIssues)
    return {
        epic,
        totalPoints: sumPointsOfIssues(childrenIssues),
        remainingPoints: sumPointsOfIssues(remainingWork),
        unestimatedStories: countUnestimatedIssues(childrenIssues),
        estimatedStories: countEstimatedIssues(childrenIssues),
    }
}

const getEstimatedDatesForEpics = async (project: Project) => {
    const epics = await fetchAllIssuesByJQL(JQL(project.id).getAllOpenEpics)

    const promises = epics.map(async (epic) => {
        return await calculateEpicData(epic)
    })
    const epicData = await Promise.all(promises)

    const results = epicData.map(epic => {
        const uncertaintyMultiplier = 1 + (epic.unestimatedStories / (epic.estimatedStories + epic.unestimatedStories))
        const velocity = 30

        const sprintsRemaining = Math.ceil(epic.remainingPoints * uncertaintyMultiplier / velocity)
        const projectedCompleteDate = new Date()
        projectedCompleteDate.setDate(projectedCompleteDate.getDate() + (14 * sprintsRemaining))

        return {
            epicID: epic.epic.key,
            totalPoints: epic.totalPoints,
            remainingPoints: epic.remainingPoints,
            unestimatedStories: epic.unestimatedStories,
            sprintsRemaining,
            projectedCompleteDate,
            jiraLink: epic.epic.browserLink
        }
    })

    return results


    // epicChildrenQueries.map()
    // const result = await fetchAllIssuesByJQL()
    // console.log("🚀 ~ file: epic-projected-dates.ts:30 ~ getEstimatedDatesForEpics ~ epics:", epics)
}

async function run() {
    const dates = await getEstimatedDatesForEpics(projects[0])
    console.log("🚀 ~ file: epic-projected-dates.ts:34 ~ run ~ score:", dates)



    process.exit(0)
}

run().then(() => process.exit(0))
