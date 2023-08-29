import { type Response, type Request, type NextFunction } from 'express'
import { type ValidationChain, validationResult, body, param, query, type ValidationError, type CustomValidator } from 'express-validator'
import * as articleService from '../service/article'
import { ArticleSortType, ArticleSortDirection } from '../utils/types'

const notEmptyValidator: CustomValidator = async (value) => {
  if (value.trim() === '') {
    throw new Error('cant be empty')
  }
}

export default function validate(validations: ValidationChain[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(async validation => await validation.run(req)))

    const errorFormatter = ({ location, msg, param }: ValidationError): string => {
      return `${location === undefined ? '' : location}[${param}]: ${String(msg)}`
    }
    const errors = validationResult(req).formatWith(errorFormatter)
    if (errors.isEmpty()) {
      next()
      return
    }

    res.status(422).json({ error: errors.array().join('; ') })
  }
}

/**
 * 查询接口参数校验
 * @param q 查询语句 (<=50字符)
 * @param pp 每页数量 (1-99) 默认10
 * @param pn 页码 (1-) 默认1
 * @param sort 依据什么排序
 * @param direction 排序方向
 */
export const getArticleValidator = (): ValidationChain[] => [
  query('q').default('').isLength({ max: 50 }).withMessage('查询语句过长'),
  query('pp').default(10).isInt({ gt: 0, lt: 100 }).toInt(),
  query('pn').default(1).isInt({ gt: 0 }).toInt(),
  query('sort').default(ArticleSortType.TIME).isIn(Object.values(ArticleSortType)),
  query('direction').default(ArticleSortDirection.ASC).toInt().isIn(Object.values(ArticleSortDirection))
]

export const getIdParamValidator = (): ValidationChain[] => [param('id').isMongoId().withMessage('格式错误')]

export const getLikeArticleValidator = (): ValidationChain[] => [
  ...getIdParamValidator(),
  body('operation').notEmpty().isIn([])
]

/**
 * 上传接口参数校验
 * @param text
 * @param uploader
 */
export const getCreateArticleValidator = (): ValidationChain[] => [
  body('text')
    .custom(notEmptyValidator).withMessage('文本不能为空')
    .isLength({ min: 30, max: 1000 }).withMessage('语句长度应在30-1000之间')
    .custom(async (value) => {
      const article = await articleService.getOneByText(value)
      if (article !== null) {
        return await Promise.reject(new Error('该语句已存在'))
      }
    }),
  body('uploader')
    .custom(notEmptyValidator).withMessage('上传者不能为空')
    .not().isIn(['admin']).withMessage('上传者不能为admin')
]
