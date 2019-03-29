'use strict'

const mql = require('@microlink/mql')

module.exports = async ({ query }) => {
  const { username, force = false } = query

  if (!username) {
    throw new TypeError(`You need to pass 'username' as query parameter `)
  }

  const { data } = await mql(`https://twitter.com/${username}`, {
    force,
    rules: {
      avatarUrl: {
        type: 'image',
        selectors: {
          selector: '.ProfileAvatar-image',
          attr: 'src'
        }
      },
      bio: {
        selectors: {
          selector: '.ProfileHeaderCard-bio',
          attr: 'text'
        }
      },
      name: {
        selectors: {
          selector: '.ProfileHeaderCard-nameLink',
          attr: 'text'
        }
      },
      tweets: {
        selectors: {
          selector: 'ol > li',
          attr: {
            id: {
              selector: '.tweet-timestamp',
              attr: 'data-conversation-id',
              type: value => `https://twitter.com/${value}`
            },
            text: {
              selector: '.tweet-text',
              attr: 'text'
            },
            tweetUrl: {
              selector: '.tweet-timestamp',
              attr: 'href'
            }
          }
        }
      }
    }
  })

  const { tweets, bio, name, avatarUrl } = data

  const [pinnedTweet, ...restTweets] = tweets

  return { pinnedTweet, tweets: restTweets, bio, name, avatarUrl }
}

module.exports.help = 'Get the Twitter profile for any twitter username.'

module.exports.flags = `
  --username        Twitter username for fetching profile. [required]
`
