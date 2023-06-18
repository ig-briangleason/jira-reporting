require('dotenv').config()
export const config = {
    username: process.env.JIRA_USERNAME,
    apiToken: process.env.JIRA_API_TOKEN,
}

export const jiraRequestOptions = (method: 'GET' | 'POST') => {
    return {
        method: method,
        headers: {
            Authorization: 'Basic ' + Buffer.from(config.username + ":" + config.apiToken).toString('base64')
        }
    }
}