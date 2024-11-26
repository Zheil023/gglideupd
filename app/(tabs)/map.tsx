import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text, Modal } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useRoute } from '@react-navigation/native';
import { collection, deleteDoc, doc, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebaseconfig';
import { color } from 'react-native-elements/dist/helpers';

const storeLayoutImage = require('../../assets/images/store.png');

// Hardcoded category markers with coordinates and unique colors


export default function MapScreen() {
  const route = useRoute();
  const { selectedCategories = [] } = route.params || {}; // Set a default empty array
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(false); // Track modal visibility
  const [selectedImage, setSelectedImage] = useState(null); // Store the selected image URL
  const [showAllMarkers, setShowAllMarkers] = useState(false); // New state for showing all markers
  const [markerPositions, setMarkerPositions] = useState([]);

  //Upload Markers to firebase

  


  // Fetch markers in Firebase

  const MapScreen = () => {
  
    useEffect(() => {
      const unsubscribe = onSnapshot(collection(db, 'Markers'), (snapshot) => {
        const Markers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          location: {
            x: parseInt(doc.data().location.x, 10), // Convert to integer if needed
            y: parseInt(doc.data().location.y, 10)
          }
        }));
        setMarkerPositions(Markers);
      });
  
      // Cleanup listener on unmount
      return () => unsubscribe();
    }, []);
  
    return (
      <View>
        {markerPositions.map(marker => (
          <View
            key={marker.id}
            style={{
              position: 'absolute',
              left: marker.location.x,
              top: marker.location.y,
              backgroundColor: marker.color,
              width: 10,
              height: 10,
              borderRadius: 5
            }}
          />
        ))}
      </View>
    );
  };
  
//Verify Firestore Query and Data Mapping

useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, 'Markers'), (snapshot) => {
    const Markers = snapshot.docs.map((doc) => {
      const data = doc.data();
      console.log('Marker data:', data); // Debug log
      return {
        id: doc.id,
        ...data,
        location: {
          x: parseInt(data.location?.x, 10) || 0, // Default to 0 if missing or invalid
          y: parseInt(data.location?.y, 10) || 0,
        },
      };
    });

    setMarkerPositions(Markers);
  });

  return () => unsubscribe(); // Cleanup listener
}, []);
 
  


  // Fetch selected items in real-time from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'SelectedItems'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Group items by name and category, and sum quantities
      const groupedItems = items.reduce((acc, item) => {
        const key = `${item.name}-${item.category}`;
        if (!acc[key]) {
          acc[key] = { ...item, quantity: 1 };
        } else {
          acc[key].quantity += 1;
        }
        return acc;
      }, {});

      // Convert object to array
      setSelectedItems(Object.values(groupedItems).filter(item => selectedCategories.includes(item.category)));
    });
    return () => unsubscribe();
  }, [selectedCategories]);

  // Filter markers based on unique categories in selectedItems
  const filteredMarkers = Array.from(
    new Set(selectedItems.map(item => item.category)) // Filter unique categories
  ).map(category => markerPositions.find(marker => marker.category === category))
    .filter(Boolean); // Remove any undefined entries

  // Function to handle item removal
  const handleRemoveItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, 'SelectedItems', itemId));
      setSelectedItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // Handle marker tap to display image
  const handleMarkerPress = (marker) => {
    const selectedItem = selectedItems.find(item => item.category === marker.category);
    if (selectedItem?.imageUrl) { // Ensure the item has an image URL
      setSelectedImage(selectedItem.imageUrl);  // Set the image URL
      setShowModal(true);  // Open the modal
    }
  };

  // Render markers on the map based on the selected items' categories
  const renderMarkers = () => {
    const markersToRender = showAllMarkers ? markerPositions : filteredMarkers;
    return markersToRender.map((marker) => (
      <Circle
        key={`${marker.id}-${marker.category}`}  // Ensure uniqueness
        cx={marker.location.x}
        cy={marker.location.y}
        r="6"
        fill={marker.color}
        onPress={() => handleMarkerPress(marker)} // Handle marker tap
      />
    ));
  };

  // Toggle the visibility of all markers
  const toggleShowAllMarkers = () => {
    setShowAllMarkers(prevState => !prevState);
  };

  return (
    <View style={styles.container}>
      <Image source={storeLayoutImage} style={styles.storeLayout} />

      <Svg style={styles.svgOverlay}>
        {renderMarkers()}
      </Svg>

      <View style={styles.itemList}>
        {selectedItems.length === 0 ? (
          <Text style={styles.emptyText}>No items selected.</Text>
        ) : (
          selectedItems.map((item, index) => (
            <View key={`${item.id}-${index}`} style={styles.itemContainer}>
              <Text style={styles.itemText}>
                {item.name} ({item.category}) {item.quantity > 1 ? `${item.quantity}x` : ''}
              </Text>
              <TouchableOpacity
                onPress={() => handleRemoveItem(item.id)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* Button to toggle visibility of all markers */}
      <TouchableOpacity onPress={toggleShowAllMarkers} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>
          {showAllMarkers ? 'Show Only Selected Markers' : 'Show All Markers'}
        </Text>
      </TouchableOpacity>

      {/* Modal for displaying the image */}
      <Modal visible={showModal} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
            <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
  },
  storeLayout: {
    width: Dimensions.get('window').width - 20,
    height: 400,
    resizeMode: 'contain',
  },
  svgOverlay: {
    position: 'absolute',
    top: 40,
    left: 10,
    width: Dimensions.get('window').width - 20,
    height: 400,
  },
  itemList: {
    marginTop: 20,
    padding: 10,
    width: '100%',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  itemText: {
    fontSize: 16,
  },
  removeButton: {
    padding: 5,
    backgroundColor: '#FF3B30',
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
  },
  toggleButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: 300,
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FF3B30',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
