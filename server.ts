import express, { Request, Response } from 'express'
import * as dotenv from 'dotenv'
import chalk from 'chalk'
import data from './demo_data.json'

const demoData: FilteredSubmissionsResponse = JSON.parse(JSON.stringify(data))

const compareValues = (left: string | number, comparison: Condition, right: string | number) => {
  if (!left || !comparison || !right) return

  if (comparison === 'equals') {
    return left == right
  } else if (comparison === 'does_not_equal') {
    return left != right
  } else if (comparison === 'greater_than') {
    return left >= right
  } else if (comparison === 'less_than') {
    return left < right
  }

  return false
}

const filterResponses = (submissions: Submissions, query: any) => {
  try {
    const parsedFilters = JSON.parse(query.filters) as ResponseFilters
    console.log(
      appName +
        chalk.green(
          `🔍 Filtering ${submissions.length} record${submissions.length != 1 ? 's' : ''} based on ${parsedFilters.length} filter${parsedFilters.length != 1 ? 's' : ''} `,
        ),
    )
    if (parsedFilters.length) {
      let filteredSubmissions = submissions
        .map((submission) => {
          let filteredQuestions = submission.questions
            .map((question) => {
              let filterChecks = parsedFilters
                .map((f) => {
                  return compareValues(question.value, f.condition, f.value) ? f : null
                })
                .filter((v) => v)

              return filterChecks.length == parsedFilters.length ? question : null
            })
            .filter((v) => v)

          return filteredQuestions.length >= parsedFilters.length ? submission : null
        })
        .filter((v) => v)

      console.log(
        appName +
          chalk.green(
            `🔍 Filtered down to ${filteredSubmissions.length} record${filteredSubmissions.length != 1 ? 's' : ''}`,
          ),
      )
      return filteredSubmissions
    } else {
      console.log(
        appName +
          chalk.green(
            `🔍 No filters; returning ${submissions.length} record${submissions.length != 1 ? 's' : ''}`,
          ),
      )
      return submissions
    }
  } catch (e) {
    console.error(e)
  }

  return submissions
}

const app = express()
const appName = chalk.hex('#1877f2')('[fillout] ')
app.use(express.json())

dotenv.config()
const { NODE_ENV, API_KEY } = process.env
const isProd = NODE_ENV === 'production'
const port = isProd ? 80 : 3000

app.get('/ping', (req: Request, res: Response) => {
  res.json({
    message: 'pong',
  })
})

app.get('/:formId/filteredResponses', (req: Request, res: Response) => {
  const formId = req.params.formId
  const query = req.query
  if (!isProd) {
    const filteredResponses = filterResponses(demoData.responses as Submissions, query)
    return res.json({
      responses: filteredResponses,
      totalResponses: filteredResponses.length,
      pageCount: 1,
    })
  }

  const url = `https://api.fillout.com/v1/api/forms/${formId}/submissions`
  const headers = { 'content-type': 'application/json', Authorization: `Bearer ${API_KEY}` }
  fetch(url, { headers })
    .then((response) => response.json())
    .then((r: any) => {
      const filteredResponses = filterResponses(r.responses, query)
      res.json({
        responses: filteredResponses,
        totalResponses: filteredResponses.length,
        pageCount: 1,
      })
    })
    .catch((err) => {
      console.log(err)
      res.json(err)
    })
})

app.listen(port, () => {
  if (API_KEY) {
    console.log(appName + chalk.yellow('🔑 API key present'))
  } else {
    console.log(chalk.red('🛑 please provide required .env data'))
  }

  console.log(appName + chalk.green(`👂 listening http://localhost:${port}`))
})
