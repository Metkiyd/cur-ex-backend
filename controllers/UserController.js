import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";
import {TokenService} from '../services/index.js'

export const register = async (req, res) => {
  try {

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      fullName: req.body.fullName,
      email: req.body.email.toLowerCase(),
      passwordHash: hash,
      wallets: req.body.wallets,
      avatarUrl: req.body.avatarUrl,
    });

    const user = await doc.save();

    //
    // const token = jwt.sign({
    //     _id: user._id,
    //   },
    //   'secret123',
    //   {
    //     expiresIn: '30d',
    //   },
    // );
    //

    const tokens = TokenService.generateTokens({
      _id: user._id,
    })
    await TokenService.saveToken(user._id, tokens.refreshToken)

    res.cookie('refreshToken',tokens.refreshToken, {maxAge:30*24*60*60*1000, httpOnly: true})

    const { passwordHash, ...userData } = user._doc
    res.json({
      ...userData,
      ...tokens,
      //
      // token
      //


    });
  } catch (err) {
    console.log('=>err', err)
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    })
  }

};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email.toLowerCase()
    });

    if (!user) {
      return res.status(404).json({
        message: 'Неверный логин или пароль'
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль'
      });
    }

    //
    // const token = jwt.sign({
    //     _id: user._id,
    //   },
    //   'secret123',
    //   {
    //     expiresIn: '30d',
    //   },
    // );
    //

    const tokens = TokenService.generateTokens({
      _id: user._id,
    })
    await TokenService.saveToken(user._id, tokens.refreshToken)

    res.cookie('refreshToken',tokens.refreshToken, {maxAge:30*24*60*60*1000, httpOnly: true})
    const { passwordHash, ...userData } = user._doc

    res.json({
      ...userData,
      ...tokens,
      //
      // token
      //
    });

  } catch (err) {
    console.log('=>err', err)
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    })
  }

};


export const refresh = async (req, res) => {
  try {
    const {refreshToken} = req.cookies
    // console.log('=>refreshToken', refreshToken)

    if (!refreshToken) {
      return res.status(401).json({
        message: 'cookies token error'
      });
    }

    const userData = TokenService.validateRefreshToken(refreshToken)

    const tokenFromDB = await TokenService.findToken(refreshToken)

    if (!userData || !tokenFromDB) {
      return res.status(401).json({
        message: 'Авторизуйтесь заново (refresh token check failed) '
      });
    }

    const user = await UserModel.findById(userData._id)

    const tokens = TokenService.generateTokens({
      _id: user._id,
    })
    await TokenService.saveToken(user._id, tokens.refreshToken)

    res.cookie('refreshToken',tokens.refreshToken, {maxAge:30*24*60*60*1000, httpOnly: true})
    const { passwordHash, ...userDatan } = user._doc
    res.json({
      ...userDatan,
      ...tokens
    })

  } catch (e) {
    console.log(e)
  }
}

export const update = async (req, res) => {
  try {
    const user = req.user._id;
    try {
      await UserModel.updateOne(
        {
          _id: user,
        },
        {
          fullName: req.body.fullName,
          email: req.body.email.toLowerCase(),
          city: req.body.city,
          birthday: req.body.birthday,
          phone: req.body.phone,
          avatarUrl: req.body.avatarUrl,
        },
      );
    } catch (e) {
      console.log(e)
    }



    res.json({
      success:true,
    });

  } catch (err) {
    console.log('=>err', err)
    res.status(500).json({
      message: 'Не удалось сохранить изменения',
    });
  }
}
export const logout = async (req, res) => {
  try {
    const {refreshToken} = req.cookies
    const tokend = await TokenService.removeToken(refreshToken)
    res.clearCookie('refreshToken')
    res.json(tokend)


  } catch (e) {
    console.log(e)

  }

}

// export const getMe = async (req, res) => {
//   try {
//     const user = await UserModel.findById(req.userId);
//     // console.log('=>user', user)
//
//     if (!user) {
//       return res.status(404).json({
//         message: 'Пользователь не найден'
//       })
//     }
//
//     const { passwordHash, ...userData } = user._doc
//
//     res.json(userData);
//
//   } catch (err) {
//     console.log('=>err', err)
//     res.status(500).json({
//       message: 'Не удалось ',
//     })
//   }
// };
