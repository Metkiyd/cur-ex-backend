import express from 'express'
import cors from 'cors'
import multer from "multer"
import mongoose from 'mongoose'
import {registerValidation, loginValidation, postCreateValidation} from "./validations/validations.js";
import {UserController, PostController} from './controllers/index.js'
import {checkAuth, handeValidationErrors} from './utils/index.js'


mongoose
  .connect('mongodb+srv://admin:admin@cluster0.g19olum.mongodb.net/finance?retryWrites=true&w=majority')
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
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/register', registerValidation, handeValidationErrors, UserController.register);
app.post('/auth/login', loginValidation, handeValidationErrors, UserController.login);
app.get('/auth/me', UserController.getMe);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', postCreateValidation, handeValidationErrors, PostController.create);
app.patch('/posts/:id', postCreateValidation, handeValidationErrors, PostController.update);
app.delete('/posts/:id', PostController.remove);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});

// app.get('/', (req, res) => {
//
//   res.send('Hello');
//
// });