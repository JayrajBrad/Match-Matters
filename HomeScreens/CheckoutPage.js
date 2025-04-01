// import React, { useState, useContext } from "react";
// import {
//   View,
//   Text,
//   Button,
//   Alert,
//   Linking,
//   TouchableOpacity,
// } from "react-native";
// import { useRoute } from "@react-navigation/native";
// import { UserContext } from "../navigation/UserProvider";
// import { API_URL } from "@env";

// const CheckoutPage = ({ navigation }) => {
//   const route = useRoute();
//   const { eventId, ticketPrice, title } = route.params || {};
//   const { userId, user } = useContext(UserContext);

//   const [paymentLink, setPaymentLink] = useState("");
//   const [paymentLinkId, setPaymentLinkId] = useState("");

//   const createPaymentLink = async () => {
//     if (!userId) {
//       Alert.alert("Error", "No user is logged in.");
//       return;
//     }
//     try {
//       const response = await fetch(`${API_URL}/create-payment`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: user?.username, // from context, e.g. "Atharv Patil"
//           email: user?.emailId, // from context, e.g. "atharvpatil@..."
//           phone: user?.phoneNumber, // from context, e.g. 1234567890
//           amount: parseFloat(ticketPrice),
//           eventId: eventId,
//           userId: userId,
//         }),
//       });
//       const data = await response.json();

//       // The Cashfree API response typically includes { link_id, link_url, ... }
//       if (data.link_url && data.link_id) {
//         setPaymentLink(data.link_url); // e.g. "https://payments.cashfree.com/link/someHash"
//         setPaymentLinkId(data.link_id); // e.g. "cf_x4kce1yd"
//       } else if (data.link_url) {
//         // Some older docs: link_id might not be top-level.
//         // If you can't find `link_id` in `data`, you can store it from your server's "shortId"
//         setPaymentLink(data.link_url);
//         Alert.alert(
//           "Warning",
//           "No link_id found in response, status checks won't work directly."
//         );
//       } else {
//         Alert.alert("Error", data.error || "Failed to create payment link");
//       }
//     } catch (error) {
//       console.error("Error creating payment link:", error);
//       Alert.alert("Error", "An error occurred while creating the payment link");
//     }
//   };

//   // Step 2: Add a function to create a ticket
//   const createTicket = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/create-ticket`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: userId,
//           eventId: eventId,
//           linkId: paymentLinkId,
//         }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         // Ticket created
//         // data.ticket has the ticket doc
//         Alert.alert("Success", "Your ticket is generated!");

//         // Navigate to TicketScreen, for example
//         navigation.navigate("TicketScreen", {
//           ticketData: data.ticket, // or whatever you want to pass
//           eventTitle: title,
//         });
//       } else {
//         Alert.alert("Error", data.error || "Failed to create ticket");
//       }
//     } catch (err) {
//       console.error("Error creating ticket:", err);
//       Alert.alert("Error", "Server error while creating ticket");
//     }
//   };

//   // Step 1: Check Payment Status
//   const checkStatus = async () => {
//     if (!paymentLinkId) {
//       Alert.alert("Error", "No payment link ID found");
//       return;
//     }
//     try {
//       // 1) Ask the server to both check CF and update Payment in DB
//       const response = await fetch(
//         `${API_URL}/check-and-update-payment/${paymentLinkId}`
//       );
//       const data = await response.json();
//       console.log("Payment status check & update result:", data);

//       if (data.link_status) {
//         if (data.link_status === "PAID") {
//           Alert.alert(
//             "Payment Success",
//             "Your ticket has been confirmed! Generating ticket..."
//           );
//           // If paid, create a ticket
//           await createTicket();
//         } else if (data.link_status === "ACTIVE") {
//           Alert.alert(
//             "Payment Pending",
//             "Your link is still active or not completed."
//           );
//         } else if (data.link_status === "EXPIRED") {
//           Alert.alert("Payment Link Expired", "Please generate a new link.");
//         } else {
//           Alert.alert("Payment Status", `Status: ${data.link_status}`);
//         }
//       } else {
//         Alert.alert("Error", data.error || "Could not retrieve link_status");
//       }
//     } catch (error) {
//       console.error("Error checking/updating payment status:", error);
//       Alert.alert("Error", "Failed to check/update payment status.");
//     }
//   };
//   const handleOpenLink = () => {
//     if (paymentLink) {
//       Linking.openURL(paymentLink);
//     }
//   };

//   return (
//     <View style={{ flex: 1, padding: 20, marginTop: 50 }}>
//       <Text style={{ fontSize: 20, marginBottom: 10 }}>Checkout</Text>
//       <Text>Event: {title}</Text>
//       <Text>Event ID: {eventId}</Text>
//       <Text>User ID: {userId}</Text>
//       <Text>Price: {ticketPrice}</Text>

//       <Button title="Generate Payment Link" onPress={createPaymentLink} />

//       {paymentLink ? (
//         <View style={{ marginTop: 20 }}>
//           <Text style={{ marginBottom: 10 }}>Payment Link:</Text>
//           <Text selectable style={{ color: "blue" }}>
//             {paymentLink}
//           </Text>

//           <TouchableOpacity
//             onPress={handleOpenLink}
//             style={{ marginVertical: 10 }}
//           >
//             <Text style={{ color: "green" }}>Open in Browser</Text>
//           </TouchableOpacity>

//           {/* Button to check status (which also triggers ticket creation if PAID) */}
//           <Button title="Check Payment Status" onPress={checkStatus} />
//         </View>
//       ) : null}
//     </View>
//   );
// };

// export default CheckoutPage;

// import React, { useState, useContext } from "react";
// import {
//   View,
//   Text,
//   Alert,
//   Linking,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
// } from "react-native";
// import { useRoute } from "@react-navigation/native";
// import { UserContext } from "../navigation/UserProvider";
// import { API_URL } from "@env";

// const CheckoutPage = ({ navigation }) => {
//   const route = useRoute();
//   const { eventId, ticketPrice, title } = route.params || {};
//   const { userId, user } = useContext(UserContext);

//   const [paymentLink, setPaymentLink] = useState("");
//   const [paymentLinkId, setPaymentLinkId] = useState("");

//   const createPaymentLink = async () => {
//     if (!userId) {
//       Alert.alert("Error", "No user is logged in.");
//       return;
//     }
//     try {
//       const response = await fetch(`${API_URL}/create-payment`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: user?.username,
//           email: user?.emailId,
//           phone: user?.phoneNumber,
//           amount: parseFloat(ticketPrice),
//           eventId: eventId,
//           userId: userId,
//         }),
//       });
//       const data = await response.json();

//       // Expecting { link_id, link_url, ... } in response
//       if (data.link_url && data.link_id) {
//         setPaymentLink(data.link_url);
//         setPaymentLinkId(data.link_id);
//         Alert.alert("Success", "Payment link generated!");
//       } else if (data.link_url) {
//         setPaymentLink(data.link_url);
//         Alert.alert(
//           "Warning",
//           "No link_id found, but link URL is available. Payment status checks may not work."
//         );
//       } else {
//         Alert.alert("Error", data.error || "Failed to create payment link");
//       }
//     } catch (error) {
//       console.error("Error creating payment link:", error);
//       Alert.alert("Error", "An error occurred while creating the payment link");
//     }
//   };

//   const createTicket = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/create-ticket`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: userId,
//           eventId: eventId,
//           linkId: paymentLinkId,
//         }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         Alert.alert("Success", "Your ticket is generated!");
//         // Navigate to some TicketScreen if you have it
//         navigation.navigate("TicketScreen", {
//           ticketData: data.ticket,
//           eventTitle: title,
//         });
//       } else {
//         Alert.alert("Error", data.error || "Failed to create ticket");
//       }
//     } catch (err) {
//       console.error("Error creating ticket:", err);
//       Alert.alert("Error", "Server error while creating ticket");
//     }
//   };

//   const checkStatus = async () => {
//     if (!paymentLinkId) {
//       Alert.alert("Error", "No payment link ID found");
//       return;
//     }
//     try {
//       const response = await fetch(
//         `${API_URL}/check-and-update-payment/${paymentLinkId}`
//       );
//       const data = await response.json();
//       console.log("Payment status check & update result:", data);

//       if (data.link_status) {
//         if (data.link_status === "PAID") {
//           Alert.alert("Payment Success", "Generating your ticket...");
//           await createTicket();
//         } else if (data.link_status === "ACTIVE") {
//           Alert.alert("Payment Pending", "Link is still active or incomplete.");
//         } else if (data.link_status === "EXPIRED") {
//           Alert.alert("Payment Link Expired", "Please generate a new link.");
//         } else {
//           Alert.alert("Payment Status", `Status: ${data.link_status}`);
//         }
//       } else {
//         Alert.alert("Error", data.error || "Could not retrieve link_status");
//       }
//     } catch (error) {
//       console.error("Error checking payment status:", error);
//       Alert.alert("Error", "Failed to check payment status.");
//     }
//   };

//   const handleOpenLink = () => {
//     if (paymentLink) {
//       Linking.openURL(paymentLink);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.card}>
//         <Text style={styles.headerText}>Checkout</Text>
//         <View style={styles.divider} />

//         <View style={styles.section}>
//           <Text style={styles.label}>Event:</Text>
//           <Text style={styles.value} numberOfLines={1}>
//             {title}
//           </Text>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.label}>Event ID:</Text>
//           <Text style={styles.value}>{eventId}</Text>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.label}>Price:</Text>
//           <Text style={styles.value}>₹{ticketPrice}</Text>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.label}>User:</Text>
//           <Text style={styles.value}>{user?.username}</Text>
//         </View>

//         <TouchableOpacity
//           style={styles.generateLinkBtn}
//           onPress={createPaymentLink}
//         >
//           <Text style={styles.generateLinkBtnText}>Generate Payment Link</Text>
//         </TouchableOpacity>

//         {paymentLink ? (
//           <View style={{ marginTop: 20 }}>
//             <TouchableOpacity
//               style={styles.openBrowserBtn}
//               onPress={handleOpenLink}
//             >
//               <Text style={styles.openBrowserBtnText}>Open Payment Link</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.checkStatusBtn}
//               onPress={checkStatus}
//             >
//               <Text style={styles.checkStatusBtnText}>
//                 Check Payment Status
//               </Text>
//             </TouchableOpacity>
//           </View>
//         ) : null}
//       </View>
//     </SafeAreaView>
//   );
// };

// export default CheckoutPage;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#EFEFEF",
//     padding: 20,
//   },
//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     padding: 20,
//     elevation: 3,
//     // iOS shadow
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 4,
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: "700",
//     marginBottom: 8,
//     color: "#333333",
//   },
//   divider: {
//     height: 1,
//     backgroundColor: "#E0E0E0",
//     marginVertical: 12,
//   },
//   section: {
//     flexDirection: "row",
//     marginVertical: 5,
//     alignItems: "center",
//   },
//   label: {
//     fontSize: 16,
//     color: "#555",
//     width: 100,
//     fontWeight: "600",
//   },
//   value: {
//     fontSize: 16,
//     color: "#111",
//     flex: 1,
//     paddingLeft: 10,
//     fontWeight: "400",
//   },
//   generateLinkBtn: {
//     marginTop: 20,
//     backgroundColor: "#5B5FC7",
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   generateLinkBtnText: {
//     color: "#FFF",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   openBrowserBtn: {
//     backgroundColor: "#2196F3",
//     paddingVertical: 12,
//     borderRadius: 8,
//     marginBottom: 10,
//     alignItems: "center",
//   },
//   openBrowserBtnText: {
//     color: "#FFF",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   checkStatusBtn: {
//     backgroundColor: "#4CAF50",
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   checkStatusBtnText: {
//     color: "#FFF",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Alert,
  Linking,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { UserContext } from "../navigation/UserProvider";
import { API_URL } from "@env";
import axios from "axios";
// We’ll use the built-in Picker component for a basic dropdown:
import { Picker } from "@react-native-picker/picker";

const CheckoutPage = ({ navigation }) => {
  const route = useRoute();
  const { eventId, ticketPrice, title } = route.params || {};
  const { userId, user } = useContext(UserContext);

  const [paymentLink, setPaymentLink] = useState("");
  const [paymentLinkId, setPaymentLinkId] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState({ id: null, value: 0 });

  // For coupons
  const [coupons, setCoupons] = useState([]);
  const [selectedCouponValue, setSelectedCouponValue] = useState(0);
  const [loadingCoupons, setLoadingCoupons] = useState(true);

  // -------------
  // 1) Fetch the user’s coupons on mount
  // -------------
  useEffect(() => {
    const fetchUserCoupons = async () => {
      if (!userId) return; // no user => no fetch
      try {
        setLoadingCoupons(true);
        const response = await axios.get(`${API_URL}/user/${userId}/coupons`);
        // e.g. response.data = [ { _id: "...", code: "ABCDE", value: 500, ... } ]
        setCoupons(response.data || []);
      } catch (err) {
        console.error("Error fetching coupons:", err);
        Alert.alert(
          "Error",
          "Failed to fetch coupons. Please try again later."
        );
      } finally {
        setLoadingCoupons(false);
      }
    };

    fetchUserCoupons();
  }, [userId]);

  // -------------
  // 2) Derived state: final price calculation
  // -------------
  // platform fee is 5% of the ticket price => ticketPrice * 0.05
  // or you can do an integer approach if you want to avoid floating issues.
  const platformFee = ticketPrice * 0.05;
  let baseAmount = ticketPrice + platformFee; // ex: 1000 + 50 = 1050
  // subtract coupon
  baseAmount = baseAmount - selectedCoupon.value;

  // clamp at 0
  if (baseAmount < 0) {
    baseAmount = 0;
  }
  const finalAmount = parseFloat(baseAmount.toFixed(2)); // round or format as needed

  // -------------
  // Payment Flow
  // -------------
  const createPaymentLink = async () => {
    if (!userId) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }
    try {
      // Notice we use finalAmount instead of ticketPrice
      // so the user only pays the discounted total + platform fee
      const response = await fetch(`${API_URL}/create-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user?.username,
          email: user?.emailId,
          phone: user?.phoneNumber,
          // server likely expects an integer in paise, or a float in rupees:
          amount: finalAmount, // <--- final discounted amount
          eventId,
          userId,
        }),
      });
      const data = await response.json();

      if (data.link_url && data.link_id) {
        setPaymentLink(data.link_url);
        setPaymentLinkId(data.link_id);
        Alert.alert("Success", "Payment link generated!");
      } else if (data.link_url) {
        setPaymentLink(data.link_url);
        Alert.alert(
          "Warning",
          "No link_id found. Payment status checks may not work."
        );
      } else {
        Alert.alert("Error", data.error || "Failed to create payment link");
      }
    } catch (error) {
      console.error("Error creating payment link:", error);
      Alert.alert("Error", "An error occurred while creating the payment link");
    }
  };

  const checkStatus = async () => {
    if (!paymentLinkId) {
      Alert.alert("Error", "No payment link ID found");
      return;
    }
    try {
      const response = await fetch(
        `${API_URL}/check-and-update-payment/${paymentLinkId}`
      );
      const data = await response.json();
      console.log("Payment status check & update result:", data);

      if (data.link_status) {
        if (data.link_status === "PAID") {
          Alert.alert("Payment Success", "Generating your ticket...");
          await createTicket();
        } else if (data.link_status === "ACTIVE") {
          Alert.alert(
            "Payment Pending",
            "Your link is still active or incomplete."
          );
        } else if (data.link_status === "EXPIRED") {
          Alert.alert("Payment Link Expired", "Please generate a new link.");
        } else {
          Alert.alert("Payment Status", `Status: ${data.link_status}`);
        }
      } else {
        Alert.alert("Error", data.error || "Could not retrieve link_status");
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      Alert.alert("Error", "Failed to check payment status.");
    }
  };

  const createTicket = async () => {
    try {
      const res = await fetch(`${API_URL}/api/create-ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          eventId,
          linkId: paymentLinkId,
          couponId: selectedCoupon?.id,
        }),
      });
      const data = await res.json();
      if (
        !res.ok &&
        data.error === "Ticket already generated for this user & event."
      ) {
        Alert.alert("Info", "You already have this ticket!");
        navigation.navigate("TicketScreen", {
          ticketData: data.ticket,
          eventTitle: title,
        });
      } else {
        Alert.alert("Error", data.error || "Failed to create ticket");
      }
    } catch (err) {
      console.error("Error creating ticket:", err);
      Alert.alert("Error", "Server error while creating ticket");
    }
  };

  const handleOpenLink = () => {
    if (paymentLink) {
      Linking.openURL(paymentLink);
    }
  };

  // -------------
  // UI
  // -------------
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headerText}>Checkout</Text>
        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.label}>Event:</Text>
          <Text style={styles.value} numberOfLines={1}>
            {title}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Event ID:</Text>
          <Text style={styles.value}>{eventId}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>User:</Text>
          <Text style={styles.value}>{user?.username}</Text>
        </View>

        {/* Show a loading indicator if we are fetching coupons */}
        {loadingCoupons ? (
          <View style={{ marginTop: 20 }}>
            <Text style={{ color: "#444" }}>Loading coupons...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.couponLabel}>Select a Coupon (Optional)</Text>
            {/* Basic dropdown using Picker */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={JSON.stringify(selectedCoupon)}
                onValueChange={(itemValue, itemIndex) => {
                  const parsed = JSON.parse(itemValue);
                  setSelectedCoupon(parsed); // { id, value }
                }}
                style={styles.picker}
              >
                <Picker.Item
                  label="No Coupon"
                  value={JSON.stringify({ id: null, value: 0 })}
                />
                {coupons.map((coupon) => (
                  <Picker.Item
                    key={coupon._id}
                    label={`${coupon.code} (₹${coupon.value} off)`}
                    value={JSON.stringify({
                      id: coupon._id,
                      value: coupon.value,
                    })}
                  />
                ))}
              </Picker>
            </View>
          </>
        )}

        {/* Price breakdown */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceRow}>
            Ticket Price: ₹{ticketPrice.toFixed(2)}
          </Text>
          <Text style={styles.priceRow}>
            + Platform Fee (5%): ₹{(ticketPrice * 0.05).toFixed(2)}
          </Text>
          {selectedCouponValue > 0 && (
            <Text style={[styles.priceRow, { color: "green" }]}>
              - Coupon Discount: ₹{selectedCouponValue.toFixed(2)}
            </Text>
          )}
        </View>

        <View style={styles.finalRow}>
          <Text style={styles.finalLabel}>Payable Amount: </Text>
          <Text style={styles.finalValue}>₹{finalAmount.toFixed(2)}</Text>
        </View>

        {/* Generate payment link button */}
        <TouchableOpacity
          style={styles.generateLinkBtn}
          onPress={createPaymentLink}
        >
          <Text style={styles.generateLinkBtnText}>Generate Payment Link</Text>
        </TouchableOpacity>

        {/* If we have a payment link, show the open & check status buttons */}
        {paymentLink ? (
          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              style={styles.openBrowserBtn}
              onPress={handleOpenLink}
            >
              <Text style={styles.openBrowserBtnText}>Open Payment Link</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkStatusBtn}
              onPress={checkStatus}
            >
              <Text style={styles.checkStatusBtnText}>
                Check Payment Status
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkStatusBtn}
              onPress={() => navigation.navigate("Profile")}
            >
              <Text style={styles.checkStatusBtnText}>Back To Home</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default CheckoutPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFEF",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    color: "#333333",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 12,
  },
  section: {
    flexDirection: "row",
    marginVertical: 5,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#555",
    width: 100,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    color: "#111",
    flex: 1,
    paddingLeft: 10,
    fontWeight: "400",
  },
  couponLabel: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  pickerContainer: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginTop: 8,
  },
  picker: {
    width: "100%",
    height: 50,
  },
  priceContainer: {
    marginTop: 16,
  },
  priceRow: {
    fontSize: 15,
    color: "#333",
    marginBottom: 2,
  },
  finalRow: {
    flexDirection: "row",
    marginTop: 12,
    alignItems: "center",
  },
  finalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  finalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#C81F4D",
    marginLeft: 4,
  },
  generateLinkBtn: {
    marginTop: 20,
    backgroundColor: "#5B5FC7",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  generateLinkBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  openBrowserBtn: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  openBrowserBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  checkStatusBtn: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  checkStatusBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
