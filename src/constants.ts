import chalk from 'chalk'
import * as dotenv from 'dotenv'
import data from './_demo_data.json'

dotenv.config()

export const DEMO_DATA: FilteredSubmissionsResponse = JSON.parse(JSON.stringify(data))

export const { NODE_ENV, API_KEY } = process.env

export const APP_NAME = chalk.hex('#ec4899')('[fillout] ')

export const IS_PROD = NODE_ENV === 'production'

export const PORT = IS_PROD ? 80 : 3000
