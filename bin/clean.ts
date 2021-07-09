import { rmSync } from 'fs'
import { resolve } from 'path'

const projectRoot = resolve(__dirname, '..')
const queue = [resolve(projectRoot, '.dist')]

queue.forEach(dir => {
  rmSync(dir, { recursive: true })
})
