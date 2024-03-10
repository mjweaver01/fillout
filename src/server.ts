import express, { Request, Response } from 'express'
import chalk from 'chalk'
import { demoData, API_KEY, isProd, appName, port } from './constants'
import { compareValues } from './helpers'

const filterResponses = (submissions: Submissions, query: any) => {
  const returnAll = (isError = false) => {
    if (isError) {
      console.log(
        appName + chalk.red(`🚨 Something went wrong while filtering! Check the error above 👆`),
      )
    } else {
      console.log(appName + chalk.magenta('🙅 No filters!'))
    }

    console.log(
      appName +
        chalk.magenta(
          `🪃  Returning all ${submissions.length} record${submissions.length != 1 ? 's' : ''}`,
        ),
    )
    return submissions
  }

  if (!query || !query.filters) return returnAll()

  try {
    const parsedFilters = JSON.parse(query.filters) as ResponseFilters
    console.log(
      appName +
        chalk.blue(
          `🧐 Filtering ${submissions.length} record${submissions.length != 1 ? 's' : ''} based on ${parsedFilters.length} filter${parsedFilters.length != 1 ? 's' : ''} `,
        ),
    )
    if (parsedFilters.length > 0 && Array.isArray(parsedFilters)) {
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
            .filter((f) => f)

          return matchedFilters.length === parsedFilters.length ? submission : null
        })
        .filter((s) => s)

      console.log(
        appName +
          chalk.magenta(
            `✅ Filtered down to ${filteredSubmissions.length} record${filteredSubmissions.length != 1 ? 's' : ''}`,
          ),
      )
      return filteredSubmissions
    } else {
      return returnAll()
    }
  } catch (e) {
    console.error(e)
    return returnAll(true)
  }
}

const app = express()
app.use(express.json())

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
