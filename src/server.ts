import express, { Request, Response } from 'express'
import chalk from 'chalk'
import { DEMO_DATA, API_KEY, IS_PROD, APP_NAME, PORT } from './constants'
import { filterResponses } from './helpers'

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
  if (!IS_PROD) {
    const filteredResponses = filterResponses(DEMO_DATA.responses, query)
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

app.listen(PORT, () => {
  if (API_KEY) {
    console.log(APP_NAME + chalk.yellow('🔑 API key present'))
  } else {
    console.log(chalk.red('🛑 please provide required .env data'))
  }

  console.log(APP_NAME + chalk.green(`👂 listening http://localhost:${PORT}`))
})
