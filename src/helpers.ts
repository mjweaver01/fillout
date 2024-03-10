import { APP_NAME } from './constants'
import chalk from 'chalk'

export const isDate = (date: string) => {
  return (
    (new Date(date) as unknown as string) !== 'Invalid Date' &&
    !isNaN(new Date(date) as unknown as number)
  )
}

export const isNumeric = (value: string) => {
  return /^-?\d+$/.test(value)
}

export const compareValues = (left: string, comparison: Condition, right: string) => {
  if (!left || !comparison || !right) return false

  const l = isDate(left) ? new Date(left).getTime() : isNumeric(left) ? parseInt(left) : left
  const r = isDate(right) ? new Date(right).getTime() : isNumeric(right) ? parseInt(right) : right

  switch (comparison) {
    case 'equals':
      return l === r
    case 'does_not_equal':
      return l !== r
    case 'greater_than':
      return l > r
    case 'less_than':
      return l < r
    default:
      return false
  }
}

// BUSINESS LOGIC
// for each submission,
// each filter must have:
// at least one corresponding question
export const filterResponses = (submissions: Submissions, query: any) => {
  const returnAll = (isError = false) => {
    console.log(
      APP_NAME +
        (isError
          ? chalk.red(`🚨 Something went wrong while filtering! Check the error above 👆`)
          : chalk.magenta('🙅 No filters!')),
    )
    console.log(
      APP_NAME +
        chalk.magenta(
          `🪃  Returning all ${submissions.length} record${submissions.length != 1 ? 's' : ''}`,
        ),
    )
    return submissions
  }

  if (!query || !query.filters || submissions.length === 0) return returnAll()

  try {
    const parsedFilters = JSON.parse(query.filters) as ResponseFilters
    console.log(
      APP_NAME +
        chalk.blue(
          `🧐 Filtering ${submissions.length} record${submissions.length != 1 ? 's' : ''} based on ${parsedFilters.length} filter${parsedFilters.length != 1 ? 's' : ''} `,
        ),
    )
    if (!Array.isArray(parsedFilters) || parsedFilters.length === 0) return returnAll()

    const filteredSubmissions = submissions.filter((submission) => {
      // every() to ensure that all filters are matched for a submission
      return parsedFilters.every((filter) => {
        const { id, value, condition } = filter

        // some() to check if any question matches a filter within a submission
        return submission.questions.some((question) => {
          return (
            // wanted to check both KVs (id and type) just incase :)
            (id === question.id || id === question.type) &&
            // type coercion here vs above
            compareValues(question.value.toString(), condition, value.toString())
          )
        })
      })
    })

    console.log(
      APP_NAME +
        chalk.magenta(
          `✅ Filtered down to ${filteredSubmissions.length} record${filteredSubmissions.length != 1 ? 's' : ''}`,
        ),
    )

    return filteredSubmissions
  } catch (e) {
    console.error(e)
    return returnAll(true)
  }
}
