import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, Image, StyleSheet } from 'react-native';
import { useCart } from './CartContext';
import productsData from './productsData.json'; // Import the JSON file

const ProductsScreen = ({ navigation }) => {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Set products from the imported JSON data
        setProducts(productsData);
    }, []);

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Products</Text>
        <ScrollView>
          {products.map(item => (
            <ProductItem key={item.id} item={item} addToCart={() => addToCart(item)} />
          ))}
        </ScrollView>
        <Button
          onPress={() => navigation.navigate('Cart')}
          title="Cart"
          color="#000" // Change the color as needed
        />
      </View>
    );
};

const ProductItem = ({ item, addToCart }) => (
  <View style={styles.productItem}>
    <Image source={{ uri: item.image }} style={styles.productImage} />
    <Text style={styles.productText}>{item.name} </Text>
    <Text style={styles.productText}>${item.price.toFixed(2)} </Text>
    <Button title="Add to Cart" onPress={addToCart} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black', // Change the background color as needed
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  productItem: {
    marginBottom: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  productText: {
    color: 'white',
  },
});

export default ProductsScreen;