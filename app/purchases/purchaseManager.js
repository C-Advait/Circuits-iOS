import api from "./Api";
import { finishTransaction } from "react-native-iap";

const purchaseItem = async (sku) => {
  try {
    const purchase = await RNIap.requestPurchase(sku);
    sendPurchaseToServer(purchase);
  } catch (err) {
    console.warn(err); // standardized error handling
  }
};

const sendPurchaseToServer = async (purchase) => {
  console.log(purchase);
  try {
    const response = await api.post("/verify", {
      userId: "your-user-id", // from your user management logic
      deviceId: "your-device-id", // from your device information logic
      transactionId: purchase.transactionId,
      productId: purchase.productId,
      receiptData: purchase.transactionReceipt,
    });

    if (response.ok) {
      // Handle the successful response here
      finishTransaction(purchase, true);
    } else {
      // Handle the response error here
      console.error("API Error:", response.problem);
    }
  } catch (err) {
    console.error("Error sending purchase to server:", err);
  }
};

// TODO: Get user status. Forget about caching right now.

// const purchaseUpdatedListener = (listener) => {
// Implement the purchase updated logic
// };

// const purchaseErrorListener = (listener) => {
// Implement the purchase error logic
// };

export {
  purchaseItem,
  // purchaseUpdatedListener,
  // purchaseErrorListener,
};
