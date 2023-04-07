import mongoose from 'mongoose'

export interface ArticleBase {
  text: string
  likes: number
  uploader: string
  uploadTime: Date
}

export type ArticleDocument = ArticleBase & mongoose.Document

const articleSchema = new mongoose.Schema({
  text: { type: String, unique: true },
  likes: Number,
  uploader: String,
  uploadTime: Date
})

const ArticleModel = mongoose.model<ArticleDocument>('articles', articleSchema)

export default ArticleModel
