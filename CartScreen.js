// CartScreen.js

import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useCart } from './CartContext';

const CartScreen = () => {
  const { cart, removeFromCart } = useCart();

  // Calculate total price
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
    </View>
  );
};

const CartItem = ({ item, removeFromCart }) => (
  <View style={styles.cartItem}>
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
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
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
  }
});

export default CartScreen;