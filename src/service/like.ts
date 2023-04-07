import LikeModel, { type LikeDocument } from '../models/like'
import ip from 'ip'
import { increaseLikes } from './article'

export async function getOneByIp(ipAdress: string): Promise<LikeDocument | null> {
  return await LikeModel.findOne({ ip: ip.toBuffer(ipAdress) })
}

export async function isLikedOne(aid: string, ipAdress: string): Promise<boolean> {
  const temp = await getOneByIp(ipAdress)
  if (temp !== null) {
    return temp.isLike(aid)
  } else return false
}

export async function likeOne(aid: string, ipAdress: string): Promise<void> {
  if ((await getOneByIp(ipAdress)) !== null) {
    await LikeModel.updateOne({ ip: ip.toBuffer(ipAdress) }, { $push: { likes: aid } })
  } else await LikeModel.create({ ip: ip.toBuffer(ipAdress), likes: [aid] })
  await increaseLikes(aid, 1)
}

export async function unlikeOne(aid: string, ipAdress: string): Promise<void> {
  await LikeModel.updateOne({ ip: ip.toBuffer(ipAdress) }, { $pull: { likes: aid } })
  await increaseLikes(aid, -1)
}
