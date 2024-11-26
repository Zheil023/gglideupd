import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebaseconfig';

export default function Category({ category }) {
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Canned');

  useEffect(() => {
    GetCategories();
  }, []);

  const GetCategories = async () => {
    const categoryArray = [];
    const snapshot = await getDocs(collection(db, 'Category'));
    snapshot.forEach((doc) => {
      categoryArray.push(doc.data());
    });
    setCategoryList(categoryArray);
  };

  return (
    <View style={styles.categoryWrapper}>
      <Text style={styles.categoryText}>Category</Text>

      <View style={styles.categoryContainer}>
        {categoryList.map((item) => (
          <TouchableOpacity
            key={item.name} // Use item name for keys
            onPress={() => {
              setSelectedCategory(item.name);
              category(item.name);
            }}
            style={styles.categoryItem}
          >
            <View style={[styles.container, selectedCategory === item.name && styles.selectedCategoryContainer]}>
              <Image
                source={{ uri: item?.imageUrl }}
                style={styles.categoryImage}
              />
            </View>
            <Text style={styles.itemName}>{item?.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryWrapper: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Distribute items evenly
  },
  categoryImage: {
    marginTop: 20,
    width: 70,
    height: 70,
  },
  categoryText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  categoryItem: {
    width: '30%', // Set each item to occupy 30% of the container width
    marginBottom: 15,
  },
  container: {
    backgroundColor: '#F3D0D7',
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#F3D0D7',
    justifyContent: 'center',
  },
  itemName: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  selectedCategoryContainer: {
    backgroundColor: 'lightblue',
    borderColor: 'lightblue',
  },
});
