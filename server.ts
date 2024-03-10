import express, { Request, Response } from 'express'
import * as dotenv from 'dotenv'
import chalk from 'chalk'
import data from './demo_data.json'

const demoData: FilteredSubmissionsResponse = JSON.parse(JSON.stringify(data))

const isDate = (date: string | number) => {
  return (new Date(date) as any) !== 'Invalid Date' && !isNaN(new Date(date) as any)
}

const isNumeric = (value: string) => {
  return /^-?\d+$/.test(value)
}

const compareValues = (left: string | number, comparison: Condition, right: string | number) => {
  if (!left || !comparison || !right) return false

  const l = isDate(left)
    ? new Date(left).getTime()
    : isNumeric(left.toString())
      ? parseInt(left.toString())
      : left
  const r = isDate(right)
    ? new Date(right).getTime()
    : isNumeric(right.toString())
      ? parseInt(right.toString())
      : right

  if (comparison === 'equals') return l == r
  if (comparison === 'does_not_equal') return l != r
  if (comparison === 'greater_than') return l > r
  if (comparison === 'less_than') return l < r

  return false
}

const filterResponses = (submissions: Submissions, query: any) => {
  const noQuery = () => {
    console.log(
      appName +
        chalk.blue(
          `🔍 No filters; returning ${submissions.length} record${submissions.length != 1 ? 's' : ''}`,
        ),
    )
    return submissions
  }

  if (!query || Object.keys(query.length <= 0)) return noQuery()

  try {
    const parsedFilters = JSON.parse(query.filters) as ResponseFilters
    console.log(
      appName +
        chalk.blue(
          `🔍 Filtering ${submissions.length} record${submissions.length != 1 ? 's' : ''} based on ${parsedFilters.length} filter${parsedFilters.length != 1 ? 's' : ''} `,
        ),
    )
    if (parsedFilters.length > 0) {
      let filteredSubmissions = submissions
        .map((submission) => {
          let matchedFilters = parsedFilters
            .map((filter) => {
              let matchedQuestions = submission.questions
                .map((question) => {
                  if (filter.id === question.id || filter.id === question.type) {
                    if (compareValues(question.value, filter.condition, filter.value)) {
                      return question
                    }
                  }

                  return null
                })
                .filter((q) => q)

              return matchedQuestions.length > 0
            })
            .filter((f) => !!f)

          return matchedFilters.length === parsedFilters.length ? submission : null
        })
        .filter((f) => !!f)

      console.log(
        appName +
          chalk.blue(
            `🔍 Filtered down to ${filteredSubmissions.length} record${filteredSubmissions.length != 1 ? 's' : ''}`,
          ),
      )
      return filteredSubmissions
    } else {
      return noQuery()
    }
  } catch (e) {
    console.error(e)
  }

  return submissions
}

const app = express()
const appName = chalk.hex('#ec4899')('[fillout] ')
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
