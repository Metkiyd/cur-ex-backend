import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find(
      {
        user: req.user._id,
      },
    );


    res.json(posts);

  } catch (err) {
    console.log('=>err', err)
    res.status(500).json({
      message: 'Не удалось найти кошельки',
    })
  }
};

// export const getOne = async (req, res) => {
//   try {
//     const postId = req.params.id;
//
//     PostModel.findOneAndUpdate(
//       {
//         _id: postId,
//       },
//       {
//         $inc: {viewsCount: 1},
//       },
//       {
//         returnDocument: 'after',
//       },
//       (err, doc) => {
//
//         if (err) {
//           console.log('=>err', err)
//           return res.status(500).json({
//             message: 'Не удалось вернуть статью',
//           });
//         }
//
//         if (!doc) {
//           return res.status(404).json({
//             message: 'Статья не найдена',
//           });
//         }
//
//         res.json(doc);
//       },
//     );
//
//
//   } catch (err) {
//     console.log('=>err', err)
//     res.status(500).json({
//       message: 'Не удалось получить статьи',
//     })
//   }
// };

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      user: req.user._id,
      number: req.body.number,
      balance: req.body.balance,
      currency: req.body.currency,
      icon: req.body.icon,
      sign: req.body.sign
    });

    const post = await doc.save();

    res.json(post);

  } catch (err) {
    console.log('=>err', err)
    res.status(500).json({
      message: 'Не удалось создать кошелёк',
    })

  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        user: req.user._id,
        balance: req.body.balance,
      },
    );

    res.json({
      success:true,
    });

  } catch (err) {
    console.log('=>err', err)
    res.status(500).json({
      message: 'Не удалось обновить кошелёк',
    });
  }
}
export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {

        if (err) {
          console.log('=>err', err)
          res.status(500).json({
            message: 'Не удалось удалить кошелёк',
          })
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Кошелёк не найден',
          });
        }

        res.json({
          success: true,
        });

      });


  } catch (err) {
    console.log('=>err', err)
    res.status(500).json({
      message: 'Не удалось найти кошельки',
    })
  }
};
