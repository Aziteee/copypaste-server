import { type Response, type Request } from 'express'
import { type ArticleDocument, type ArticleBase } from '../models/article'
import { type ArticleSortDirection, ArticleSortType } from '../utils/enums'
import * as articleService from '../service/article'
import * as likeService from '../service/like'
import logger from '../utils/logger'
import dayjs from 'dayjs'

type ArticleOutput = Omit<ArticleBase, 'uploadTime'> & { id: string, uploadTime: string }

/**
 * 将文档转换为输出格式
 */
function convertArticle(article: ArticleDocument): ArticleOutput {
  return {
    id: String(article._id),
    text: article.text,
    likes: article.likes,
    uploader: article.uploader,
    uploadTime: dayjs(article.uploadTime).format('YYYY/MM/DD')
  }
}

function getIpFromReq(req: Request<unknown, unknown, unknown>): string {
  return req.headers['x-forwarded-for'] as string ?? req.ip
}

interface GetArticleReqQuery {
  kw: string
  pp: number
  pn: number
  sort: ArticleSortType
  direction: ArticleSortDirection
}

export async function getArticlesHandler(req: Request, res: Response): Promise<void> {
  const query = req.query as unknown
  const { kw, pp, pn, sort, direction } = query as GetArticleReqQuery

  try {
    let data: ArticleDocument[] = []
    let total = pp
    if (sort === ArticleSortType.RANDOM) {
      data = await articleService.getRandom(pp)
    } else {
      ({ data, total } = await articleService.query(kw, pp, pn, sort, direction))
    }

    const articles = data.map(convertArticle)

    res.set('total', total.toString())
    res.json(articles)
  } catch (error) {
    res.sendStatus(500)

    logger.error(`error when query articles: ${String(error)}`)
  }
}

export async function getArticleByIdHandler(req: Request, res: Response): Promise<void> {
  try {
    const article = await articleService.getOneById(req.params.id)
    if (article === null) throw new Error()
    else res.json(convertArticle(article))
  } catch (error) {
    res.status(404).json({ error: 'NO corresponding article' })
  }
}

export async function isLikedArticleHandler(req: Request, res: Response): Promise<void> {
  const ipAdress = getIpFromReq(req)
  const liked = await likeService.isLikedOne(req.params.id, ipAdress)
  res.sendStatus(liked ? 204 : 404)
}

export async function likeArticleHandler(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const ipAdress = getIpFromReq(req)
  try {
    if (await likeService.isLikedOne(id, ipAdress)) {
      res.sendStatus(304) // already liked
    } else {
      await likeService.likeOne(id, ipAdress)
      res.sendStatus(204)
    }
  } catch (error) {
    res.sendStatus(500)

    logger.error(`error when like article '${id}' by ip '${ipAdress}': ${String(error)}`)
  }
}

export async function unlikeArticleHandler(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  const ipAdress = getIpFromReq(req)
  try {
    if (await likeService.isLikedOne(id, ipAdress)) {
      await likeService.unlikeOne(id, ipAdress)
      res.sendStatus(204)
    } else {
      res.sendStatus(304) // not liked
    }
  } catch (error) {
    res.sendStatus(500)

    logger.error(`error when unlike article '${id}' by ip '${ipAdress}': ${String(error)}`)
  }
}

export async function createArticleHandler(req: Request<unknown, unknown, { text: string, uploader: string }>, res: Response): Promise<void> {
  const { text, uploader } = req.body
  const article = await articleService.createOne(text, uploader)
  res.status(201).json(convertArticle(article))

  logger.info(`new article(${String(article._id)}) created by ${uploader} ip ${getIpFromReq(req)}\n${text.substring(0, 20)}`)
}
