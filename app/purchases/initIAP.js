import {
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  finishTransaction,
  getSubscriptions,
  getProducts,
} from "react-native-iap";
import { SKU } from "../config/skus";

export default async function initIAP() {
  try {
    // Set up listeners first.
    this.purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase) => {
        console.log("purchaseUpdatedListener", purchase);
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          // Record in DB.
          await finishTransaction({ purchase, isConsumable: false });
          console.log("finish: ", finish);
        }
      },
    );

    this.purchaseErrorSubscription = purchaseErrorListener((error) => {
      console.warn("purchaseErrorListener", error);
    });

    // Then, try to initialize the IAP connection.
    await initConnection()
      .then(() => {
        _getSubscriptions([SKU.MONTHLY]);
      })
      .then(() => {
        _getProducts([SKU.LIFETIME]);
      });
  } catch (err) {
    console.warn("Couldn't initialize IAP.", err);
  }
}

const _getProducts = async (skus) => {
  try {
    await getProducts({ skus: skus });
  } catch (error) {
    console.error("Failed to load products", error);
  }
};

const _getSubscriptions = async (skus) => {
  try {
    await getSubscriptions({ skus: skus });
  } catch (error) {
    console.error("Failed to load subscriptions", error);
  }
};
