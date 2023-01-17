import TransactionModel from "../models/Transaction.js";

export const getAll = async (req, res) => {
  try {
    const transaction = await TransactionModel.find(
      {
        user: req.userId,
      },
    );

    res.json(transaction);

  } catch (err) {
    console.log('=>err', err)
    res.status(500).json({
      message: 'Не удалось получить транзакцию',
    })
  }
};

export const create = async (req, res) => {
  try {
    const doc = new TransactionModel({
      user: req.userId,
      from: req.body.from,
      to: req.body.to,
      send: req.body.send,
      received: req.body.received
    });

    const transaction = await doc.save();

    res.json(transaction);

  } catch (err) {
    console.log('=>err', err)
    res.status(500).json({
      message: 'Не удалось создать транзакцию',
    })

  }
};
export const remove = async (req, res) => {
  try {
    const transactionId = req.params.id;

    TransactionModel.findOneAndDelete(
      {
        _id: transactionId,
      },
      (err, doc) => {

        if (err) {
          console.log('=>err', err)
          res.status(500).json({
            message: 'Не удалось удалить транзакцию',
          })
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Транзакция не найдена',
          });
        }

        res.json({
          success: true,
        });

      });


  } catch (err) {
    console.log('=>err', err)
    res.status(500).json({
      message: 'Не удалось получить транзакцию',
    })
  }
};