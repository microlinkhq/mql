#!/usr/bin/env node
'use strict'

const indentString = require('indent-string')
const terminalLink = require('terminal-link')
const beautyError = require('beauty-error')
const prettyBytes = require('pretty-bytes')
const existsFile = require('exists-file')
const clipboardy = require('clipboardy')
const sizeof = require('object-sizeof')
const prettyMs = require('pretty-ms')
const timeSpan = require('time-span')
const { isEmpty } = require('lodash')
const path = require('path')

const { gray, jsome, gradient, pink } = require('./colors')

const pkg = require('../package.json')

require('update-notifier')({ pkg }).notify()

const cli = require('meow')({
  pkg,
  description: false,
  help: require('./help')
})

const exitOnError = err => {
  console.log()
  console.error(beautyError(err))
  process.exit(1)
}

const main = async () => {
  const [exampleName] = cli.input

  if (!exampleName) cli.showHelp()

  const filepath = path.resolve(__dirname, '../examples', exampleName)

  if (!existsFile.sync(filepath)) {
    throw TypeError(`Example '${exampleName}' not exist.`)
  }

  const fn = require(filepath)

  if (isEmpty(cli.flags)) {
    console.log(gray(`\n${indentString(fn.help, 2)}`))
    console.log(gray(`  \n  Flags${indentString(fn.flags, 2)}`))
    process.exit()
  }

  const end = timeSpan()
  return [await fn({ query: cli.flags }), end()]
}

main()
  .then(([data, time]) => {
    jsome(data)

    if (!cli.flags.quiet) {
      console.log(`\n  `, gradient('Microlink Query Language'), '\n')
      console.log(
        `   ${pink('source:')} ${terminalLink(
          `examples/${cli.input[0]}`,
          `https://github.com/microlinkhq/mql/tree/master/examples/${
            cli.input[0]
          }`
        )}`
      )
      console.log(`   ${pink('status:')} success`)
      console.log(`     ${pink('size:')} ${prettyBytes(sizeof(data))}`)
      console.log(`     ${pink('time:')} ${prettyMs(time)}`)
    }

    if (cli.flags.copy) {
      clipboardy.writeSync(JSON.stringify(data, null, 2))
      console.log(`\n   ${gray('Copied to clipboard!')}`)
    }

    process.exit()
  })
  .catch(exitOnError)
