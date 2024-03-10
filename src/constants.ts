import chalk from 'chalk'
import * as dotenv from 'dotenv'
import data from '../demo_data.json'

export const demoData: FilteredSubmissionsResponse = JSON.parse(JSON.stringify(data))

dotenv.config()

export const appName = chalk.hex('#ec4899')('[fillout] ')
export const { NODE_ENV, API_KEY } = process.env
export const isProd = NODE_ENV === 'production'
export const port = isProd ? 80 : 3000
