import chalk from 'chalk'
import express, { Request, Response } from 'express'
import { DEMO_DATA, API_KEY, IS_PROD, APP_NAME, PORT } from './constants'
import { filterResponses } from './helpers'

const app = express()
app.use(express.json())

app.get('/ping', (req: Request, res: Response) => {
  res.json({
    message: 'pong',
  })
})

app.get('/:formId/filteredResponses', async (req: Request, res: Response) => {
  const formId = req.params.formId
  const query = req.query

  try {
    let responseData: any[]

    if (IS_PROD) {
      const url = `https://api.fillout.com/v1/api/forms/${formId}/submissions`
      const headers = { 'content-type': 'application/json', Authorization: `Bearer ${API_KEY}` }
      const response = await fetch(url, { headers })
      const data = (await response.json()) as { responses: Submissions }
      responseData = data.responses
    } else {
      responseData = DEMO_DATA.responses
    }

    const filteredResponses = filterResponses(responseData, query)
    res.json({
      responses: filteredResponses,
      totalResponses: filteredResponses.length,
      pageCount: 1,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.listen(PORT, () => {
  if (API_KEY) {
    console.log(APP_NAME + chalk.yellow('🔑 API key present'))
  } else {
    console.log(chalk.red('🛑 please provide required .env data'))
  }

  console.log(APP_NAME + chalk.green(`👂 Listening http://localhost:${PORT}`))
})
