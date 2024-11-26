import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';
import { FlatList } from 'react-native-gesture-handler';

export default function Slider() {
  const [sliderList, setSliderList] = useState([]);

  useEffect(() => {
    GetSliders();
  }, []);

  const GetSliders = async () => {
    const snapshot = await getDocs(collection(db, 'Sliders'));
    const sliders = snapshot.docs.map(doc => doc.data()); 
    setSliderList(sliders); 
  };

  return (
    <View style={styles.container}>
      {sliderList.length > 0 ? (
        <FlatList 
          data={sliderList}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()} 
          renderItem={({ item }) => (
            <View>
              <Image 
                source={{ uri: item?.imageUrl }}
                style={styles.sliderImage}
              />
            </View>
          )}
        />
      ) : (
        <Text style={styles.placeholderText}>No sliders available</Text> // Placeholder text
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  sliderImage: {
    width: Dimensions.get('screen').width * 0.9,
    height: 170,
    borderRadius: 15,
    marginRight: 15,
  },
  placeholderText: {
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 20,
  },
});
