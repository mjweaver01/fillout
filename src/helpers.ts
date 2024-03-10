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
