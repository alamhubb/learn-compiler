//对于token，只有追加，新建，跳过三种处理方式
//只要能判断这三种方式就行
//如果状态不为操作，和num和id，则都是新建，为空跳过

//定义语言规则类
class LangRule {
  ruleName: string
  ruleRE: RegExp
  type: string

  constructor(ruleName: string, ruleRE: string, type = LangRuleType.DEFAULT) {
    this.ruleName = ruleName;
    this.ruleRE = new RegExp(ruleRE);
    this.type = type;
  }
}

class LangRuleName {
  static INIT = 'INIT'
  static ID = 'ID'
  static NUM = 'NUM'
  static PLUS = 'PLUS'
  static Minus = 'Minus'
  static Star = 'Star'
  static Slash = 'Slash'
  static OPERATE = 'OPERATE'
}

class LangRuleType {
  static DEFAULT = 'DEFAULT'
  static CUSTOM = 'CUSTOM'
}

class Token {
  type: string
  text: string
}

const parse = '2+3*5'

const parseAry = parse.split('')

//语言规则Map
const langRuleMap = new Map<string, LangRule>()
//设置各种规则和名称
langRuleMap.set(LangRuleName.ID, new LangRule(LangRuleName.ID, '[a-zA-Z_]', LangRuleType.CUSTOM))
langRuleMap.set(LangRuleName.NUM, new LangRule(LangRuleName.NUM, '\\d', LangRuleType.CUSTOM))
langRuleMap.set(LangRuleName.PLUS, new LangRule(LangRuleName.PLUS, '\\+'))
langRuleMap.set(LangRuleName.Minus, new LangRule(LangRuleName.Minus, '\\-'))
langRuleMap.set(LangRuleName.Star, new LangRule(LangRuleName.Star, '\\*'))
langRuleMap.set(LangRuleName.Slash, new LangRule(LangRuleName.Slash, '\\/'))

const langRuleNames: string[] = []

for (const langRuleName of langRuleMap.keys()) {
  const langRule = langRuleMap.get(langRuleName)
  //只有custom的才需要追加，否则都是直接新建
  if (langRule.type === LangRuleType.CUSTOM) {
    langRuleNames.push(langRuleName)
  }
}

let tokenStatus = LangRuleName.INIT

const tokens: Token[] = []


for (const string of parseAry) {
  if (string.trim()) {
    //如果为>
    if (tokenStatus === LangRuleName.OPERATE) {
      if (string === '=') {
        tokens[tokens.length - 1].text += string
        continue
      }
      //如果为连续标识符
    } else if (langRuleNames.includes(tokenStatus)) {
      const langRule = langRuleMap.get(tokenStatus)
      if (langRule.ruleRE.test(string)) {
        tokens[tokens.length - 1].text += string
        continue
      }
    }
    //且为大于或者等于
    if (string === '>' || string === '=') {
      tokenStatus = LangRuleName.OPERATE
      const token = new Token()
      token.type = LangRuleName.OPERATE
      token.text = string
      tokens.push(token)
      continue
    } else {
      //都不符合，则为一个新token节点
      let flag = false
      for (const langRule of langRuleMap.values()) {
        if (langRule.ruleRE.test(string)) {
          tokenStatus = langRule.ruleName
          const token = new Token()
          token.type = langRule.ruleName
          token.text = string
          tokens.push(token)
          flag = true
          break
        }
      }
      if (flag) {
        continue
      }
    }
  }
  //都不满足，则改为初始状态
  tokenStatus = LangRuleName.INIT
}

console.log(tokens)


