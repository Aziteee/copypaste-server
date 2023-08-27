import express from 'express'
import config from 'config'

import * as articleController from './controllers/article'
import * as validators from './middleware/validator'
import validate from './middleware/validator'

const app = express()

app.set('port', config.get<number>('port'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/articles', validate(validators.getArticleValidator()), articleController.getArticlesHandler)
app.get('/api/articles/:id', validate(validators.getIdParamValidator()), articleController.getArticleByIdHandler)

app.get('/api/articles/:id/liked', validate(validators.getIdParamValidator()), articleController.isLikedArticleHandler)
app.put('/api/articles/:id/liked', validate(validators.getIdParamValidator()), articleController.likeArticleHandler)
app.delete('/api/articles/:id/liked', validate(validators.getIdParamValidator()), articleController.unlikeArticleHandler)

app.post('/api/articles', validate(validators.getCreateArticleValidator()))

export default app
