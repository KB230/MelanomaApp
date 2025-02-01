import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, Text, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';

export default function GalleryScreen() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserIdAndImages = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;

        console.log('User:', user);

        if (user) {
          const { data: imageList, error: listError } = await supabase.storage
            .from('image_files')
            .list(user.id, { limit: 100 });

          console.log('Image List:', imageList);

          if (listError) throw listError;

          const imagesWithUrls = imageList.map((image) => {
            const publicUrl = supabase.storage
              .from('image_files')
              .getPublicUrl(`${user.id}/${image.name}`).data.publicUrl;

            console.log('Public URL:', publicUrl);

            return {
              ...image,
              url: publicUrl,
            };
          });

          console.log('Images with URLs:', imagesWithUrls);

          setImages(imagesWithUrls);
        }
      } catch (err) {
        console.error('Error fetching images:', err);
        setError(err.message || 'Failed to load images.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserIdAndImages();
  }, []);

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
        keyExtractor={(item) => item.id || `${item.name}-${item.created_at}`} // Use a unique key
        numColumns={3} // Set the number of columns in the grid
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.url }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  imageContainer: {
    flex: 1,
    margin: 5, // Add margin for spacing between images
  },
  image: {
    width: '100%', // Take up the full width of the container
    aspectRatio: 1, // Maintain a square aspect ratio
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