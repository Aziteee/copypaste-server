import ArticleModel, { type ArticleDocument } from '../models/article'
import { type ArticleSortDirection, type ArticleSortType } from '../utils/types'
import { parseQueryCode } from '../utils/utils'

export async function getRandom(num: number = 1): Promise<ArticleDocument[]> {
  const articles = await ArticleModel.aggregate([{ $sample: { size: num } }])
  return articles
}

export async function getOneById(id: string): Promise<ArticleDocument | null> {
  const article = await ArticleModel.findById(id)
  return article
}

export async function getOneByText(text: string): Promise<ArticleDocument | null> {
  const article = await ArticleModel.findOne({ text })
  return article
}

export async function createOne(text: string, uploader: string): Promise<ArticleDocument> {
  const article = await ArticleModel.create({
    text,
    uploader,
    likes: 0,
    uploadTime: new Date(Date.now())
  })
  return article
}

export async function query(
  q: string,
  pp: number,
  pn: number,
  sort: ArticleSortType,
  direction: ArticleSortDirection
): Promise<{ data: ArticleDocument[], total: number }> {
  const skip = pp * (pn - 1)

  const parsedQuery = parseQueryCode(q)

  console.log(parsedQuery)

  const { data, count } = (await ArticleModel.aggregate([
    { $match: parsedQuery },
    { $sort: { [sort]: direction } },
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: pp }],
        count: [{ $count: 'total' }]
      }
    }
  ]))[0]

  return { data, total: count[0] === undefined ? 0 : count[0].total }
}

export async function increaseLikes(id: string, inc: number): Promise<void> {
  await ArticleModel.updateOne({ _id: id }, { $inc: { likes: inc } })
}
