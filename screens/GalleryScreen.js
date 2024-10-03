import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, Text } from 'react-native';
import { supabase } from '../lib/supabase';

export default function GalleryScreen() {
  const [images, setImages] = useState([]);
  const [userId, setUserId] = useState(null); // Hold the user ID

  useEffect(() => {
    // Fetch the user ID once the component mounts
    const fetchUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchImages(user.id); // Pass the user ID to fetch images
      }
    };
    fetchUserId();
  }, []);

  const fetchImages = async (userId) => {
    const { data, error } = await supabase.storage
      .from('image_files')
      .list(userId, { limit: 100 });

    if (error) {
      console.error('Error fetching images:', error);
    } else {
      setImages(data || []);
    }
  };

  if (!userId) {
    return <Text>Loading...</Text>;  // Show a loading state until the userId is set
  }

  return (
    <View>
      <FlatList
        data={images}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <Image
            source={{ uri: `${supabase.storage.from('image_files').getPublicUrl(`${userId}/${item.name}`).publicURL}` }}
            style={{ width: 256, height: 256 }}
          />
        )}
      />
    </View>
  );
}
