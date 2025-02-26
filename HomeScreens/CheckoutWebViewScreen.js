// // CheckoutWebViewScreen.js
// import React from "react";
// import { View, StyleSheet } from "react-native";
// import { WebView } from "react-native-webview";

// export default function CheckoutWebViewScreen() {
//   const htmlContent = `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <title>Inline Checkout Page</title>
//         <meta charset="utf-8" />
//       </head>
//       <body style="font-family: sans-serif; padding: 20px;">
//         <h1>Hello from Inline HTML!</h1>
//         <p>This is a test to see if the WebView works in our Checkout flow.</p>
//         <button onclick="alert('Thanks for your test payment!')">
//           Pay Now
//         </button>
//       </body>
//     </html>
//   `;

//   return (
//     <View style={styles.container}>
//       <WebView
//         source={{ html: htmlContent }}
//         // If you want to catch message from inside the HTML, use onMessage
//         // onMessage={(event) => { ... handle messages ... }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });
