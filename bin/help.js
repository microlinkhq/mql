'use strict'

const path = require('path')
const fs = require('fs')

const { gray, gradient } = require('./colors')

const examplesPath = path.resolve(__dirname, '../examples')

const examples = fs.readdirSync(examplesPath).map(name => {
  const example = require(`${examplesPath}/${name}`)
  return `  ${name}         ${example.help}`
})

module.exports = gray(`${gradient('Microlink Query Language')}

Usage
  $ mql-run <example>

Flags
  --copy          copy output to clipboard. [default=false]
  --quiet         don't show additional information. [default=false]

Examples Availables
${examples}
`)
