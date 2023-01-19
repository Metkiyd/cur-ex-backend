import {TokenService} from '../services/index.js'

export default (req, res,next) => {
    try {
      const authToken = (req.headers.authorization || '').replace(/Bearer\s?/, '');
      // console.log('=>authtoken', authToken)

      if (!authToken) {
        return res.status(401).json({
          message: 'Нет доступа (headers.token not found)',
        })
      }
      const userData = TokenService.validateAccessToken(authToken)

      if (!userData) {
        return res.status(401).json({
          message: 'Нет доступа (access token error)',
        })
      }

      req.user = userData

      next();
    } catch (e) {
      return res.status(401).json({
        message: 'Нет доступа (token error)',
      })
    }


}