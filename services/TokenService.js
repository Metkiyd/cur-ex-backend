import jwt from "jsonwebtoken";
import TokenModel from '../models/Token.js'


  export const generateTokens = (payload) => {
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET,
      {expiresIn: '30m'})

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      {expiresIn: '30d'})

    return {
      accessToken,
      refreshToken
    }

  }
export const validateAccessToken = (tokend) => {
  try {
    const decoded = jwt.verify(tokend, process.env.JWT_ACCESS_SECRET);
    return decoded
  } catch (e) {
    return null

  }

}
export const validateRefreshToken = (tokend) => {
  try {
    const decoded = jwt.verify(tokend, process.env.JWT_REFRESH_SECRET);
    return decoded
  } catch (e) {
    return null

  }

}

  export const saveToken = async (userId, refreshToken) => {
    const tokenData = await TokenModel.findOne( {user: userId} )
    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }
    const tokend = await TokenModel.create( { user: userId, refreshToken } )
    return tokend

  }

export const removeToken = async (refreshToken) => {
  const tokenData = await TokenModel.deleteOne( {refreshToken} )
  return tokenData

}

export const findToken = async (refreshToken) => {
  const tokenData = await TokenModel.findOne( {refreshToken} )
  return tokenData

}