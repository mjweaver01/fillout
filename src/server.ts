import express, { Request, Response } from 'express'
import chalk from 'chalk'
import { demoData, API_KEY, isProd, appName, port } from './constants'
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
  if (!isProd) {
    const filteredResponses = filterResponses(demoData.responses, query)
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
