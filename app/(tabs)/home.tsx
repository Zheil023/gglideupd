import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Slider from '../../components/Home/Slider'; 
import ItemsByCategory from '../../components/Home/ItemsByCategory';

export default function HomeScreen() {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Slider /> 
      <ItemsByCategory />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 50, // Add bottom padding if necessary
  },
});
