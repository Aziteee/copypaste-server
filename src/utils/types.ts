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

export type MongoCompareParameter = '$gt' | '$gte' | '$lt' | '$lte'

export type IMongoCompare = Partial<Record<MongoCompareParameter, number | Date>>
