import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import { UserContext } from "../../navigation/UserProvider";

const CouponScreen = () => {
  const { userId } = useContext(UserContext); // Get the user ID from context
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's coupons
  const fetchUserCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/user/${userId}/coupons`);
      setCoupons(response.data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      Alert.alert("Error", "Failed to fetch coupons. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCoupons();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#814C68" />
        <Text style={styles.loadingText}>Fetching your coupons...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Coupons</Text>
      {coupons.length > 0 ? (
        <FlatList
          data={coupons}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.couponCard}>
              <Text style={styles.couponCode}>Coupon Code: {item.code}</Text>
              <Text style={styles.couponValue}>Value: ${item.value}</Text>
              <Text style={styles.couponExpiry}>
                Expires On: {new Date(item.expiryDate).toLocaleDateString()}
              </Text>
              <TouchableOpacity
                style={styles.redeemButton}
                onPress={() =>
                  Alert.alert(
                    "Redeem Coupon",
                    `You can redeem this coupon during your event booking!`
                  )
                }
              >
                <Text style={styles.redeemButtonText}>Redeem</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noCouponsText}>
          You currently have no coupons available.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#814C68",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#814C68",
  },
  couponCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  couponCode: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  couponValue: {
    fontSize: 16,
    marginTop: 8,
    color: "#333",
  },
  couponExpiry: {
    fontSize: 14,
    marginTop: 4,
    color: "#888",
  },
  noCouponsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  redeemButton: {
    marginTop: 12,
    paddingVertical: 8,
    backgroundColor: "#814C68",
    borderRadius: 8,
    alignItems: "center",
  },
  redeemButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default CouponScreen;
