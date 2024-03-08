import express, { Request, Response } from 'express'
import * as dotenv from 'dotenv'
import chalk from 'chalk'

type FilterClauseType = {
  id: string
  condition: 'equals' | 'does_not_equal' | 'greater_than' | 'less_than'
  value: number | string
}

type ResponseFiltersType = ResponseFilter[]

const app = express()
const appName = chalk.hex('#1877f2')('[fillout] ')
app.use(express.json())

dotenv.config()
const { NODE_ENV, CLIENT_ID, API_KEY } = process.env
const port = NODE_ENV === 'production' ? 80 : 3000

app.get('/ping', (req: Request, res: Response) => {
  res.json({
    message: 'pong',
  })
})

app.get('/:formId/filteredResponses', (req: Request, res: Response) => {
  const formId = req.params.formId
  const url = `https://api.fillout.com/v1/api/forms/${formId}/submissions`
  const headers = { 'content-type': 'application/json', Authorization: `Bearer ${API_KEY}` }

  fetch(url, { headers })
    .then((response) => response.json())
    .then(async (response) => {
      // @TODO this is where we do the logic/filtering
      res.json(response)
    })
    .catch((err) => {
      console.log(err)
      res.json(err)
    })
})

app.listen(port, () => {
  console.log(appName + chalk.green(`🐳 listening http://localhost:${port}`))

  if (API_KEY) {
    console.log(appName + chalk.yellow('🔑 API key present'))
  } else {
    chalk.red('🛑 please provide required .env data')
  }
})
