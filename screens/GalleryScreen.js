import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { supabase } from '../lib/supabase';

export default function GalleryScreen() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [metadata, setMetadata] = useState({
    patient_id: '',
    sex: '',
    age_approx: '',
    anatom_site_general_challenge: '',
    diagnosis: '',
    benign_malignant: '',
    target: '',
  });

  useEffect(() => {
    fetchUserIdAndImages();
  }, []);

  const fetchUserIdAndImages = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      if (user) {
        const { data: imageList, error: listError } = await supabase.storage
          .from('image_files')
          .list(user.id, { limit: 100 });

        if (listError) throw listError;

        const imagesWithUrls = imageList.map((image) => {
          image.user_id = user.id;  // Dynamically add user_id
          image.url = supabase.storage
            .from('image_files')
            .getPublicUrl(`${user.id}/${image.name}`).data.publicUrl;
          return image;
        });
        
        setImages(imagesWithUrls);
      }
    } catch (err) {
      console.error('Error fetching images:', err);
      setError(err.message || 'Failed to load images.');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePress = async (image) => {
    setSelectedImage(image);
    setModalVisible(true);
    //console.log("Selected Image:", image); // Check if user_id exists in the selected image
    // Fetch existing metadata for the image
    const { data, error } = await supabase
      .from('image_metadata')
      .select('*')
      .eq('image_id', image.name)
      .eq('user_id', image.user_id)
      .single();

    if (data) {
      setMetadata({
        patient_id: data.patient_id ?? '',
        sex: data.sex ?? '',
        age_approx: data.age_approx ? String(data.age_approx) : '',
        anatom_site_general_challenge: data.anatom_site_general_challenge ?? '',
        diagnosis: data.diagnosis ?? '',
        benign_malignant: data.benign_malignant ?? '',
        target: data.target ? String(data.target) : '',
      });
    } 
    else {
      setMetadata({
        patient_id: '',
        sex: '',
        age_approx: '',
        anatom_site_general_challenge: '',
        diagnosis: '',
        benign_malignant: '',
        target: '',
      });
    }
    //console.log(metadata);
  };

  const handleSave = async () => {
    const updatedAt = new Date().toISOString();
    const { error } = await supabase
      .from('image_metadata')
      .upsert(
        {
          image_id: selectedImage.name,
          user_id: selectedImage.user_id,
          ...metadata,
          updated_at: [...(metadata.updated_at || []), updatedAt],
        },
        { onConflict: ['image_id', 'user_id'] }
      );

    if (error) {
      console.error('Error saving metadata:', error);
    } else {
      setModalVisible(false);
      fetchUserIdAndImages(); // Refresh the gallery
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (images.length === 0) {
    return <Text style={styles.noImagesText}>No images to display.</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(item) => item.id || `${item.name}-${item.created_at}`}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={styles.imageWrapper}> {/* Ensures layout integrity */}
            <TouchableOpacity onPress={() => handleImagePress(item)}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.url }} style={styles.image} resizeMode="cover" />
                <Text style={styles.imageName}>{String(item.name)}</Text>
                </View>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Metadata</Text>
          <TextInput
            style={styles.input}
            placeholder="Patient ID"
            placeholderTextColor="#999"
            value={metadata.patient_id}
            onChangeText={(text) => setMetadata({ ...metadata, patient_id: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Sex"
            placeholderTextColor="#999"
            value={metadata.sex}
            onChangeText={(text) => setMetadata({ ...metadata, sex: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Age (approx)"
            placeholderTextColor="#999"
            value={metadata.age_approx}
            onChangeText={(text) => setMetadata({ ...metadata, age_approx: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Anatom Site"
            placeholderTextColor="#999"
            value={metadata.anatom_site_general_challenge}
            onChangeText={(text) => setMetadata({ ...metadata, anatom_site_general_challenge: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Diagnosis"
            placeholderTextColor="#999"
            value={metadata.diagnosis}
            onChangeText={(text) => setMetadata({ ...metadata, diagnosis: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Benign/Malignant"
            placeholderTextColor="#999"
            value={metadata.benign_malignant}
            onChangeText={(text) => setMetadata({ ...metadata, benign_malignant: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Target"
            placeholderTextColor="#999"
            value={metadata.target === '' || metadata.target === null ? '0' : metadata.target} // Show 0 if empty string or null
            onChangeText={(text) => setMetadata({ ...metadata, target: text })}
            keyboardType="numeric"
          />
          <Button title="Save" onPress={handleSave} />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  imageWrapper: {
    width: '33.33%', // Ensures 3-column layout
    padding: 5, // Spacing between images
  },
  imageContainer: {
    alignItems:'center'
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  imageName: {
    textAlign: 'center',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noImagesText: {
    textAlign: 'center',
    marginTop: 20,
  },
});