// prettier.config.cjs
module.exports = {
  printWidth: 100, // 行长规则
  semi: true, // 行尾添加分号
  vueIndentScriptAndStyle: true, // vue文件的script标签和Style标签下的内容需要缩进
  singleQuote: true, // 强制使用单引号
  trailingComma: "all", // 在对象或数组最后一个元素后面是否加逗号
  proseWrap: "never", // 代码超出是否要换行
  htmlWhitespaceSensitivity: "strict", // 行结尾的风格
  endOfLine: "auto", // 结尾是 \n \r \n\r auto
};
