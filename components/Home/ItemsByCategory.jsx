import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Category from './Category';
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';
import ItemListCollection from '../../components/Home/ItemListCollection';
import { useNavigation } from '@react-navigation/native';

export default function ItemsByCategory() {
  const [itemList, setItemList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsCount, setSelectedItemsCount] = useState(0);
  const navigation = useNavigation();

  // Fetch items by default category when component mounts
  useEffect(() => {
    GetItemList('Canned'); // Default category
  }, []);

  // Fetch items by category from Firestore
  const GetItemList = async (category) => {
    setItemList([]); // Clear current item list
    const q = query(collection(db, 'Items'), where('category', '==', category));
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => doc.data());
    setItemList(items);
  };

  // Add item to local selectedItems state
  const handleAddItem = (item) => {
    setSelectedItems((prevItems) => [...prevItems, item]);
  };

  // Listen to real-time updates from Firestore's SelectedItems collection
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'SelectedItems'), (snapshot) => {
      const items = snapshot.docs.map((doc) => doc.data());
      setSelectedItemsCount(items.length);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ScrollView>
      <Category category={(value) => GetItemList(value)} />
      <Text style={styles.title}>View All</Text>

      
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.itemListContainer}>
          {itemList.map((item, index) => (
            <ItemListCollection
              key={index.toString()}
              product={item}
              onAdd={handleAddItem}
            />
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    marginVertical: 10,
  },
  itemListContainer: {
    flexDirection: 'row',   // Horizontally layout items
    paddingHorizontal: 2,
  },
});
