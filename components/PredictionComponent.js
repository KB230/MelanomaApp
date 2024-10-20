import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as tf from '@tensorflow/tfjs';
//import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import React, { useEffect, useState } from 'react';
import { fetch } from '@tensorflow/tfjs-react-native';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';


// Path to model.json in assets
const modelJson = require('../assets/vgg16TFJSModel/model.json');
// Array of paths to the binary weight files
const modelWeights = [
  require('../assets/vgg16TFJSModel/group1-shard1of15.bin'),
  require('../assets/vgg16TFJSModel/group1-shard2of15.bin'),
  require('../assets/vgg16TFJSModel/group1-shard3of15.bin'),
  require('../assets/vgg16TFJSModel/group1-shard4of15.bin'),
  require('../assets/vgg16TFJSModel/group1-shard5of15.bin'),
  require('../assets/vgg16TFJSModel/group1-shard6of15.bin'),
  require('../assets/vgg16TFJSModel/group1-shard7of15.bin'),
  require('../assets/vgg16TFJSModel/group1-shard8of15.bin'),
  require('../assets/vgg16TFJSModel/group1-shard9of15.bin'),
  require('../assets/vgg16TFJSModel/group1-shard10of15.bin'),
  require('../assets/vgg16TFJSModel/group1-shard11of15.bin'),
  require('../assets/vgg16TFJSModel/group1-shard12of15.bin'),
  require('../assets/vgg16TFJSModel/group1-shard13of15.bin'),
  require('../assets/vgg16TFJSModel/group1-shard14of15.bin'),
  require('../assets/vgg16TFJSModel/group1-shard15of15.bin'),
];

async function loadModel() {
  await tf.ready();
  const model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
  return model;
}



// Function to preprocess the image
async function preprocessImage(uri) {
  // Read the image as base64
  const imgB64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Convert base64 to buffer
  const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;

  // Create Uint8Array from buffer
  const imgUint8 = new Uint8Array(imgBuffer);

  // Decode image to tensor
  let imgTensor = decodeJpeg(imgUint8);

  // Resize image to match model's input shape
  imgTensor = tf.image.resizeBilinear(imgTensor, [128, 128]);

  // Normalize the image if required (e.g., divide by 255)
  //imgTensor = imgTensor.div(255.0);

  // Add a batch dimension
  const batched = imgTensor.expandDims(0);

  return batched;
}



export default function PredictionComponent({ imageUri }) {
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    async function init() {
      // Load the model
      const loadedModel = await loadModel();
      setModel(loadedModel);
    }
    init();
  }, []);

  useEffect(() => {
    async function predict() {
      if (model && imageUri) {
        const processedImage = await preprocessImage(imageUri);
        console.log("Predicting on Image");
        const prediction = model.predict(processedImage);
        console.log("Prediction made:", prediction.dataSync());
        const predictedClass = prediction.argMax(-1).dataSync()[0];
        console.log("Predicted Class:", predictedClass);
        let  output = ""
        if (predictedClass == "0"){
          output = "Benign Lesion";;
        }
        else {
          output = "Malignant Lesion"; 
        }
        // Map predictedClass to your class labels if available
        console.log("Output:", output);
        setPrediction(output);
      }
    }
    predict();
  }, [model, imageUri]);

  if (!model) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (prediction === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.predictionText}>Processing... {prediction}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.predictionText}>Predicted Class: {prediction}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    padding: 10,
    backgroundColor: '#FFF3E0', // Light cream background to match
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  predictionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a88465',  // Match prediction text color to the button color
  },
});
