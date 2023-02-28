import express from 'express'
import cors from 'cors'
import multer from "multer"
import mongoose from 'mongoose'
import {registerValidation, loginValidation, postCreateValidation} from "./validations/validations.js";
import {UserController, PostController, TransactionController} from './controllers/index.js'
import {authCheck, handeValidationErrors, router} from './utils/index.js'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import * as http from "http";

dotenv.config()
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log('->DB OK')
  })
  .catch((err) => console.log('DB err', err))

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
})
const upload = multer({storage});

app.use(express.json());
app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: '*',
}));
app.use('/uploads', express.static('uploads'));
app.use('/auth', router)

app.get('/posts', authCheck, PostController.getAll);
//
// app.get('/posts/:id', PostController.getOne);
//
app.post('/posts', authCheck, postCreateValidation, handeValidationErrors, PostController.create);
app.patch('/posts/:id', authCheck, postCreateValidation, handeValidationErrors, PostController.update);
app.delete('/posts/:id', authCheck, PostController.remove);

app.get('/transactions', authCheck, TransactionController.getAll);
app.post('/transactions', authCheck, TransactionController.create);
app.delete('/transactions/:id', authCheck, TransactionController.remove);

app.post('/upload', authCheck, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`->Server OK PORT ${PORT}`);
});