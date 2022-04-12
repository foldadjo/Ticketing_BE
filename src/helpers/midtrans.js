const midtransClient = require("midtrans-client");

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_PRODUCTION === "true", // G524778901
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

module.exports = {
  post: (data) =>
    new Promise((resolve, reject) => {
      console.log("POST MIDTRANS RUN");
      const parameter = {
        transaction_details: {
          order_id: data.id,
          gross_amount: data.total,
        },
        credit_card: {
          secure: true,
        },
      };

      snap
        .createTransaction(parameter)
        .then((transaction) => {
          resolve(transaction);
        })
        .catch((error) => {
          reject(error);
        });
    }),
  notif: (data) =>
    new Promise((resolve, reject) => {
      console.log("NOTIF MIDTRANS RUN");
      snap.transaction
        .notification(data)
        .then((statusResponse) => {
          //   console.log(statusResponse);
          resolve(statusResponse);
        })
        .catch((error) => {
          reject(error);
        });
    }),
};
