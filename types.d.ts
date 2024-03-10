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
  // don't know what these types are
  // leaving as any
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

type FilteredSubmissionsResponse = {
  responses: Submissions
  totalResponses: number
  pageCount: number
}

type DateCompare = DateConstructor | string | number
