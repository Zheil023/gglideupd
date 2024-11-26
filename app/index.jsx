import { View, Text, Button, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function Index() {
  const navigation = useNavigation();

  const handleNavigate = () => {
    navigation.navigate('(tabs)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello Welcome</Text>
      <Button
        title="Go to HomeScreen"
        onPress={handleNavigate}
        color="#a62639" // Optional: set a color for the button
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
});