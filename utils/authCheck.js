import jwt from 'jsonwebtoken'
import {TokenService} from '../services/index.js'

export default (req, res,next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
  console.log('=>token', token)
  if (token) {
    try {

      const userData = TokenService.validateAccessToken(token)

      if (!userData) {
        return res.status(401).json({
          message: 'Нет доступа, userData error',
        })
      }

      req.user = userData

      next();
    } catch (e) {
      return res.status(401).json({
        message: 'Нет доступа, token error',
      })
    }

  } else {
    return res.status(401).json({
      message: 'Нет доступа',
    })
  }

}