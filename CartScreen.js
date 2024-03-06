import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Button, Image, Alert } from 'react-native';
import { useCart } from './CartContext';
import { Linking } from 'react-native';
import branchData from './branchData.json'; // Import the branch data

const CartScreen = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [showPaymentModal, setShowPaymentModal] = useState(false); // State to control payment modal visibility
  const [showBranchModal, setShowBranchModal] = useState(false); // State to control branch selection modal visibility
  const [selectedBranch, setSelectedBranch] = useState(null); // State to hold selected branch
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null); // State to hold selected payment method

  // Calculate total price of items in cart
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Handle checkout button press
  const handleCheckout = () => {
    setShowPaymentModal(true); // Show payment modal when checkout button is pressed
  };

  // Handle payment method selection
  const handlePayment = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod); // Set selected payment method
    setShowPaymentModal(false); // Close payment modal after selecting a payment method
    if (cart.length > 0) {
      if (selectedBranch) {
        processPaymentAndSendMessage(); // Process payment and send WhatsApp message if cart is not empty and branch is selected
      } else {
        setShowBranchModal(true); // Show branch modal if cart is not empty but branch is not selected
      }
    } else {
      Alert.alert('Empty Cart', 'Please add items to your cart before proceeding.');
    }
  };

  // Handle branch selection
const handleBranchSelection = (branch) => {
  console.log('Selected Branch:', branch); // Log selected branch for debugging
  setSelectedBranch(branch); // Set selected branch
  setShowBranchModal(false);
  processPaymentAndSendMessage()
};

  // Process payment and send WhatsApp message
const processPaymentAndSendMessage = () => {
  // Format cart data for WhatsApp message
  const message = cart.map(item => `${item.quantity} ${item.name}`).join('\n');
  // Find the number associated with the selected branch
  const branchNumber = selectedBranch ? selectedBranch.number : null; // Use null instead of an empty string
  
  if (!branchNumber) {
    Alert.alert('Branch Number Missing', 'Unable to find branch number. Please select a branch again.');
    return;
  }
  // Send WhatsApp message with the formatted message and branch number
  sendWhatsAppMessage(branchNumber, message);
  // Clear the cart after payment
  clearCart();
};

// Send WhatsApp message
const sendWhatsAppMessage = (number, message) => {
  const whatsappUrl = `whatsapp://send?phone=${number}&text=${encodeURIComponent(message)}`;
  Linking.openURL(whatsappUrl);
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      <FlatList
        data={cart}
        renderItem={({ item }) => (
          <CartItem item={item} removeFromCart={removeFromCart} />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
      </View>
      <Button title="Checkout" onPress={handleCheckout} />
      {/* Payment modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPaymentModal}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.paymentText}>Choose payment method:</Text>
            <View style={styles.paymentOptions}>
              <Button title="Cash" onPress={() => handlePayment('Cash')} />
              <Button title="Card" onPress={() => handlePayment('Card')} />
            </View>
          </View>
        </View>
      </Modal>
      {/* Branch selection modal */}
      <BranchSelectionModal
        visible={showBranchModal}
        branches={branchData}
        onSelect={handleBranchSelection}
        onClose={() => setShowBranchModal(false)}
      />
    </View>
  );
};

// Branch selection modal component
const BranchSelectionModal = ({ visible, branches, onSelect, onClose }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.paymentText}>Choose a branch:</Text>
        <FlatList
          data={branches}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSelect(item)} style={styles.branchItem}>
              <Text style={styles.branchName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  </Modal>
);

// Cart item component
const CartItem = ({ item, removeFromCart }) => (
  <View style={styles.cartItem}>
    <Image source={{ uri: item.image }} style={styles.productImage} />
    <View style={styles.itemInfo}>
      <Text style={styles.productText}>{item.name}</Text>
      <Text style={styles.productText}>Quantity: {item.quantity}</Text>
      <Text style={styles.productText}>Price: ${item.price.toFixed(2)}</Text>
    </View>
    <TouchableOpacity 
      onPress={() => removeFromCart(item)}
      style={styles.button}
    >
      <Text style={styles.buttonText}>Remove</Text>
    </TouchableOpacity>
  </View>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 5,
    color: 'white',
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
    color: 'white',
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
  },
  totalContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  productText: {
    color: 'white',
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  paymentOptions: {
    width: '100%',
    alignItems: 'center', // Center horizontally
  },
  paymentText: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  branchItem: {
    padding: 10,
  },
  branchName: {
    fontSize: 16,
  },
});

export default CartScreen;