import mongoose from 'mongoose'

export interface LikeBase {
  ip: Buffer
  likes: string[]
}

export interface LikeDocument extends LikeBase, mongoose.Document {
  isLike: (aid: string) => boolean
}

const likeSchema = new mongoose.Schema({
  ip: { type: Buffer, unique: true, index: true },
  likes: Array<string>
})

likeSchema.methods.isLike = function (aid: string) {
  const document = this as LikeDocument
  return document.likes.includes(aid)
}

const LikeModel = mongoose.model<LikeDocument>('likes', likeSchema)

export default LikeModel
