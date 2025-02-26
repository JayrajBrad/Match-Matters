// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   Alert,
// } from "react-native";
// import RazorpayCheckout from "react-native-razorpay";

// const CheckoutPage = ({ route, navigation }) => {
//   const { eventId, ticketPrice, title } = route.params;
//   const [numberOfTickets, setNumberOfTickets] = useState(1);

//   const handlePayNow = () => {
//     const totalAmount = numberOfTickets * ticketPrice;

//     const options = {
//       description: `Tickets for ${title}`,
//       currency: "INR",
//       key: "rzp_test_NZoRwQzSley8g5", // Replace with Razorpay key
//       amount: totalAmount * 100, // Amount in paise
//       name: "Event Booking",
//       prefill: {
//         email: "example@example.com",
//         contact: "9999999999",
//         name: "User Name",
//       },
//       theme: { color: "#290F4C" },
//     };

//     RazorpayCheckout.open(options)
//       .then((data) => {
//         console.log("Payment Success:", data);
//         Alert.alert(
//           "Payment Successful",
//           `Payment ID: ${data.razorpay_payment_id}`
//         );
//         // Optionally log to backend or navigate
//       })
//       .catch((error) => {
//         console.error("Payment Error:", error);
//         Alert.alert(
//           "Payment Failed",
//           error.description || "An error occurred."
//         );
//       });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Checkout</Text>
//       <Text style={styles.eventTitle}>{title}</Text>
//       <View style={styles.ticketContainer}>
//         <Text style={styles.label}>Ticket Price:</Text>
//         <Text style={styles.value}>₹{ticketPrice}</Text>
//       </View>
//       <View style={styles.ticketContainer}>
//         <Text style={styles.label}>Number of Tickets:</Text>
//         <TextInput
//           style={styles.input}
//           keyboardType="numeric"
//           value={numberOfTickets.toString()}
//           onChangeText={(value) => setNumberOfTickets(parseInt(value) || 1)}
//         />
//       </View>
//       <View style={styles.ticketContainer}>
//         <Text style={styles.label}>Total Amount:</Text>
//         <Text style={styles.value}>₹{numberOfTickets * ticketPrice}</Text>
//       </View>
//       <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
//         <Text style={styles.payButtonText}>Pay Now</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#FFF",
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "#290F4C",
//   },
//   eventTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "#290F4C",
//   },
//   ticketContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   label: {
//     fontSize: 16,
//     color: "#333",
//   },
//   value: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#290F4C",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#CCC",
//     borderRadius: 8,
//     padding: 10,
//     width: 80,
//     textAlign: "center",
//   },
//   payButton: {
//     backgroundColor: "#290F4C",
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 30,
//   },
//   payButtonText: {
//     color: "#FFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default CheckoutPage;

// CheckoutPage.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

export default function CheckoutPage({ route, navigation }) {
  const { eventId, ticketPrice, title } = route.params;
  const [numberOfTickets, setNumberOfTickets] = useState(1);

  const handlePayNow = () => {
    // Instead of launching Razorpay, navigate to our test WebView screen
    navigation.navigate("CheckoutWebViewScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Checkout</Text>
      <Text style={styles.eventTitle}>{title}</Text>
      <View style={styles.ticketContainer}>
        <Text style={styles.label}>Ticket Price:</Text>
        <Text style={styles.value}>₹{ticketPrice}</Text>
      </View>
      <View style={styles.ticketContainer}>
        <Text style={styles.label}>Number of Tickets:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={numberOfTickets.toString()}
          onChangeText={(value) => setNumberOfTickets(parseInt(value) || 1)}
        />
      </View>
      <View style={styles.ticketContainer}>
        <Text style={styles.label}>Total Amount:</Text>
        <Text style={styles.value}>₹{numberOfTickets * ticketPrice}</Text>
      </View>
      <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
        <Text style={styles.payButtonText}>Pay Now (Test WebView)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#290F4C",
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#290F4C",
  },
  ticketContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#290F4C",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 10,
    width: 80,
    textAlign: "center",
  },
  payButton: {
    backgroundColor: "#290F4C",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  payButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
