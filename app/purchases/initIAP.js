import {
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  finishTransaction,
} from "react-native-iap";

export default async function initIAP() {
  try {
    await initConnection().then(() => {
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
    });
  } catch (err) {
    console.warn(err); // standardized error handling
  }
}
