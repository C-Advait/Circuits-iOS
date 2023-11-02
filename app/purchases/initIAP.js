import RNIap from "react-native-iap";

const itemSkus = Platform.select({
  ios: [
    "com.example.yourapp.premium.monthly",
    "com.example.yourapp.premium.lifetime",
  ],
});

export default async function initIAP() {
  try {
    await RNIap.initConnection();
    const products = await RNIap.getProducts(itemSkus);
    console.log(products);
  } catch (err) {
    console.warn(err); // standardized error handling
  }
}
