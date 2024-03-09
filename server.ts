import express, { Request, Response } from 'express'
import * as dotenv from 'dotenv'
import chalk from 'chalk'
import data from './demo_data.json'

type AnswerTypes =
  | 'LongAnswer'
  | 'ShortAnswer'
  | 'DatePicker'
  | 'NumberInput'
  | 'MultipleChoice'
  | 'EmailInput'

type Condition = 'equals' | 'does_not_equal' | 'greater_than' | 'less_than'

interface Question {
  id: string
  name: string
  type: AnswerTypes
  value: string | number
}

interface Submission {
  submissionId: string
  submissionTime: string
  lastUpdatedAt: string
  questions: Question[]
  calculations: any[]
  urlParameters: any[]
  quiz: any
  documents: any[]
}

type Submissions = Submission[]

interface FilterClause {
  id: string
  condition: Condition
  value: number | string
}

type ResponseFilters = FilterClause[]

const compare = (left: string | number, comparison: Condition, right: string | number) => {
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

const filterResponses = async (
  res: Response,
  submissions: Submissions,
  filters: ResponseFilters,
) => {
  let filteredSubmissions = submissions.map((s) => s)

  console.log(filters)

  res.json(filteredSubmissions)
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
  if (!isProd) {
    res.json(data)
    return
  }

  const formId = req.params.formId
  const filters = JSON.parse('') as ResponseFilters
  const url = `https://api.fillout.com/v1/api/forms/${formId}/submissions`
  const headers = { 'content-type': 'application/json', Authorization: `Bearer ${API_KEY}` }

  fetch(url, { headers })
    .then((response) => response.json())
    .then((r: any) => filterResponses(res, r.responses, filters))
    .catch((err) => {
      console.log(err)
      res.json(err)
    })
})

app.listen(port, () => {
  console.log(appName + chalk.green(`👂 listening http://localhost:${port}`))

  if (API_KEY) {
    console.log(appName + chalk.yellow('🔑 API key present'))
  } else {
    console.log(chalk.red('🛑 please provide required .env data'))
  }
})
