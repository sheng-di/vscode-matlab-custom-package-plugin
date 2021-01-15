export default class TextUtils {
  static matchAll(str: string, regex: RegExp) {
    let m;
    let result = []

    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      result.push(m)
    }
    return result
  }

  /**
   * 获取某个字符在第几行
   * @param str 字符串
   * @param i 字符索引
   */
  static getLineNumber(str: string, i: number): number {
    let num = 0
    let ii = 0
    while (ii < i) {
      if (str[ii] === '\n') {
        num++
      }
      ii++
    }
    return num
  }
}