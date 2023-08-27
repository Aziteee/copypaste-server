/**
 * 排序方式
 */
export enum ArticleSortType {
  TIME = 'uploadTime', // 时间
  LIKES = 'likes', // 点赞数
  RANDOM = 'random', // 随机
}

export enum ArticleSortDirection {
  ASC = 1, // 升序
  DESC = -1, // 倒序
}

export interface IParsedQueryCode {
  text?: string | RegExp
  uploader?: string
}
