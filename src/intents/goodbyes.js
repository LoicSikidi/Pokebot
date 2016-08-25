const toText = message => { return { type: 'text', content: message } }
const u = require('../utils.js')

const getGoodbyes = () => {
  const answers = [
    'Bye! Don\'t forget to catch\'em all.',
    'Great to talk with you!',
    'Have a nice day!',
    'See you soon.',
    'Don\t leave me alone. :cry:',
    'See ya!',
    'I\'ll be there if you need some help in your adventure.',
    'Don\'t forget I\'ll always be by your side!',
    'See you! Long reign Queen Cersei!',
  ]
  return Promise.resolve([toText(u.random(answers))])
}

module.exports = getGoodbyes
