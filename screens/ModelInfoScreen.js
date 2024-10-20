// ModelInfoScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ModelInfoScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Model Information</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Loss:</Text>
        <Text style={styles.infoValue}>0.2407</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Binary Accuracy:</Text>
        <Text style={styles.infoValue}>0.8958</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Recall:</Text>
        <Text style={styles.infoValue}>0.5010</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>ROC:</Text>
        <Text style={styles.infoValue}>0.8835</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Precision:</Text>
        <Text style={styles.infoValue}>0.1270</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>F1 Score:</Text>
        <Text style={styles.infoValue}>0.1926</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF8E1',  // Light cream background
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#8e7c5f',
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8e7c5f',
  },
  infoValue: {
    fontSize: 18,
    color: '#8e7c5f',
  },
});

export default ModelInfoScreen;
