const parse = 'age >= 40'

function isAlphabet(char: string) {
  const uniIndex = char.toLocaleLowerCase().charCodeAt(0)
  return uniIndex > 96 && uniIndex < 123
}

function isNum(char: string) {
  const uniIndex = char.toLocaleLowerCase().charCodeAt(0)
  return uniIndex > 47 && uniIndex < 58
}

const parseAry = parse.split('')

const init = 'init'
const id = 'id'
const operate = 'operate'
const num = 'num'

let tokenStatus = init

const tokens: Token[] = []

class Token {
  type: string
  text: string
}

for (const string of parseAry) {
  switch (tokenStatus) {
    case init:
      if (isAlphabet(string)) {
        tokenStatus = id
        const token = new Token()
        token.type = id
        token.text = string
        tokens.push(token)
      } else if (string === '>' || string === '=') {
        tokenStatus = operate
        const token = new Token()
        token.type = operate
        token.text = string
        tokens.push(token)
      } else if (isNum(string)) {
        tokenStatus = num
        const token = new Token()
        token.type = num
        token.text = string
        tokens.push(token)
      }
      break
    case id:
      if (isAlphabet(string)) {
        tokens[tokens.length - 1].text += string
      } else {
        tokenStatus = init
      }
      break
    case operate:
      if (string === '=') {
        tokens[tokens.length - 1].text += string
      } else {
        tokenStatus = init
      }
      break
    case num:
      if (isNum(string)) {
        tokens[tokens.length - 1].text += string
      } else {
        tokenStatus = init
      }
      break
  }
}

console.log(tokens)
