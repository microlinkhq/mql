'use strict'

const createGradient = require('gradient-string')
const jsome = require('jsome')
const chalk = require('chalk')

const gradient = createGradient([
  { color: '#F76698', pos: 0 },
  { color: '#EA407B', pos: 0.29 },
  { color: '#654EA3', pos: 1 }
])

const pink = chalk.hex('#EA407B')

jsome.colors = {
  num: 'cyan',
  str: 'green',
  bool: 'red',
  regex: 'blue',
  undef: 'grey',
  null: 'grey',
  attr: 'reset',
  quot: 'gray',
  punc: 'gray',
  brack: 'gray'
}

module.exports = {
  gradient,
  jsome,
  pink,
  gray: chalk.gray,
  white: chalk.white
}
