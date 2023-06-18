require('dotenv').config()
import { JQL, MetricGroup, PointType, Project, projects, sumPointsByJQL } from "."

const createReportJSONBlob = (project: Project, group: MetricGroup, pointType: PointType, value: number) => {
  return {
    customer: 'msl',
    data_type: 'number',
    group: group,
    id: `msl_${project.id.toLowerCase()}_backlog_health_${pointType.toLowerCase()}_points`,
    project: project.name,
    name: `Michigan ${project.name} Backlog Health ${pointType} Points`,
    timestamp: Date.now(),
    team: 'msl',
    value: value
  }
}

const getReportDataForProject = async (project: Project) => {
  const actionable = await sumPointsByJQL(JQL(project.id).getActionablePoints)
  const blocked = await sumPointsByJQL(JQL(project.id).getBlockedPoints)
  const completed = await sumPointsByJQL(JQL(project.id).getCompletedPoints)
  const total = await sumPointsByJQL(JQL(project.id).getTotalPoints)

  const result = [
    createReportJSONBlob(project, MetricGroup.backlogHealth, PointType.actionable, actionable),
    createReportJSONBlob(project, MetricGroup.backlogHealth, PointType.blocked, blocked),
    createReportJSONBlob(project, MetricGroup.backlogHealth, PointType.completed, completed),
    createReportJSONBlob(project, MetricGroup.backlogHealth, PointType.total, total),

  ]
  console.log("🚀 ~ file: jira-report-status.ts:116 ~ getReportDataForProject ~ result:", JSON.stringify(result))
}

async function run() {
  await getReportDataForProject(projects[0])
  await getReportDataForProject(projects[1])

  process.exit(0)
}

run().then(() => process.exit(0))
