import * as RNIap from 'react-native-iap';

const itemSkus = Platform.select({
  ios: [
    "p73usxu49defpfgiyr36k44thpb9taqy38j77h5z4l7xbgd0pz4qvccp3umi46z4fph2wktrmz9ro4ry1d0fz5cvnftg9uno2407"
  ],
});

const skus = [
  "p73usxu49defpfgiyr36k44thpb9taqy38j77h5z4l7xbgd0pz4qvccp3umi46z4fph2wktrmz9ro4ry1d0fz5cvnftg9uno2407"
];

export default async function initIAP() {
  try {
    // console.log(RNIap);
    const conn = await RNIap.initConnection();
    // console.log(conn);
    // await RNIap.prepare();
    const products = await RNIap.getAvailablePurchases({ skus });
    console.log('products are: ', products);
  } catch (err) {
    console.warn(err); // standardized error handling
  }
}
