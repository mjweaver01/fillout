import express, { Request, Response } from 'express'
import * as dotenv from 'dotenv'
import chalk from 'chalk'

type FilterClauseType = {
  id: string
  condition: 'equals' | 'does_not_equal' | 'greater_than' | 'less_than'
  value: number | string
}

// each of these filters should be applied like an AND in a "where" clause
// in SQL
type ResponseFiltersType = ResponseFilter[]

// -----------------------
// express app
// -----------------------
const app = express()
const appName = chalk.hex('#1877f2')('[fillout] ')
app.use(express.json())

// -----------------------
// data`
// -----------------------
dotenv.config()
const { NODE_ENV, CLIENT_ID, API_KEY } = process.env
const port = NODE_ENV === 'production' ? 80 : 3000

app.get('/', (req: Request, res: Response) => {
  return {
    message: 'hi',
  }
})

app.get('/:formId/filteredResponses', (req: Request, res: Response) => {
  const formId = req.params.formId
  const url = `https://api.fillout.com/${formId}/filteredResponses`
  const headers = { 'content-type': 'application/json', Authorization: `Bearer ${API_KEY}` }

  console.log(url, headers)

  fetch(url, headers)
    .then((response) => response.json())
    .then(async (response) => {
      console.log(Response)
      // @TODO this is where we do the logic/filtering
      res.json(response)
    })
    .catch((err) => {
      console.log(err)
      res.json(err)
    })
})

const loggy = () => {
  console.log(appName + chalk.green(`🐳 listening http://localhost:${port}`))

  if (API_KEY) {
    console.log(appName + chalk.yellow('🔑 API key present'))
  } else {
    chalk.red('🛑 please provide required .env data')
  }
}

app.listen(port, loggy)
