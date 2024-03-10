import { APP_NAME } from './constants'
import chalk from 'chalk'

export const isDate = (date: string | number) => {
  return (new Date(date) as any) !== 'Invalid Date' && !isNaN(new Date(date) as any)
}

export const isNumeric = (value: string) => {
  return /^-?\d+$/.test(value)
}

export const compareValues = (
  left: string | number,
  comparison: Condition,
  right: string | number,
) => {
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

// this is where the 🪄 happens
export const filterResponses = (submissions: Submissions, query: any) => {
  const returnAll = (isError = false) => {
    if (isError) {
      console.log(
        APP_NAME + chalk.red(`🚨 Something went wrong while filtering! Check the error above 👆`),
      )
    } else {
      console.log(APP_NAME + chalk.magenta('🙅 No filters!'))
    }

    console.log(
      APP_NAME +
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
      APP_NAME +
        chalk.blue(
          `🧐 Filtering ${submissions.length} record${submissions.length != 1 ? 's' : ''} based on ${parsedFilters.length} filter${parsedFilters.length != 1 ? 's' : ''} `,
        ),
    )
    if (Array.isArray(parsedFilters) && parsedFilters.length > 0) {
      const filteredSubmissions = submissions.filter((submission) => {
        // every() to ensure that all filters are matched for a submission
        return parsedFilters.every((filter) => {
          // some() to check if any question matches a filter within a submission
          return submission.questions.some((question) => {
            return (
              // wanted to account for both KVs here
              (filter.id === question.id || filter.id === question.type) &&
              compareValues(question.value, filter.condition, filter.value)
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
    } else {
      return returnAll()
    }
  } catch (e) {
    console.error(e)
    return returnAll(true)
  }
}
