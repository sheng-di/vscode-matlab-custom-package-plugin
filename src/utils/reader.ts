import * as iconv from 'iconv-lite'
import * as chardet from 'chardet'
import * as fs from 'fs'
/**
 * 读取文件内容
 * @param filePath 文件路径
 */
export function readContent(filePath: string) {
  const buffer = fs.readFileSync(filePath)
  const encoding = chardet.detect(buffer)
  let content: string
  if (encoding === null) {
    throw new Error('无法判断文件的编码格式')
  }
  if (encoding.toLowerCase() !== 'utf-8') {
    content = iconv.decode(buffer, encoding)
  } else {
    content = buffer.toString()
  }
  return content
}

/**
 * 将绝对路径转换为相对路径
 * 仅仅支持 windows
 * @param rootPath 根路径
 * @param absolutePath 绝对路径
 */
export function absolutePathToRelative (rootPath: string, absolutePath: string) {
  const arr1 = rootPath.split('\\')
  const arr2 = absolutePath.split('\\')
  let res = '.'
  for (let i = arr1.length; i < arr2.length; i++) {
    res = res + '/' + arr2[i]
  }
  return res
}

export function isFunction (content: string) {
  return content.indexOf('function ') !== -1
}