import { body } from "express-validator";

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 6 символов').isLength({min:6}),
];

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 6 символов').isLength({min:6}),
  body('fullName', 'Укажите Имя').isLength({min:3}),
  body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];

export const postCreateValidation = [
  body('tags', 'Неверный формат тэгов (укажите массив)').optional().isArray(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];

