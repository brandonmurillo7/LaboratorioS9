import React, { useState } from 'react';
import { StyleSheet, View, Button, Text, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '../lib/storageClient';

export default function HomeScreen() {
  const [uploading, setUploading] = useState(false);

  const uploadFileToSupabase = async (fileUri: string, fileName: string) => {
    const response = await fetch(fileUri);
    const blob = await response.blob();

    const { data, error } = await supabase.storage
      .from('tu-nombre-de-bucket') // Asegúrate de cambiar esto por tu bucket real
      .upload(fileName, blob, {
        contentType: 'image/png', 
        upsert: true,
      });

    if (error) throw error;
    return data;
  };

  const pickAndUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      
      if (!result.canceled) {
        setUploading(true);
        const file = result.assets[0];
        await uploadFileToSupabase(file.uri, file.name);
        Alert.alert('Éxito', 'Archivo subido correctamente');
      }
    } catch (error: any) {
    console.error("Error completo:", error); // Esto se verá en tu terminal de VS Code
    Alert.alert('Error', error.message || 'No se pudo subir el archivo');
  }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subir Archivo a Supabase</Text>
      {uploading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Seleccionar y Subir Archivo" onPress={pickAndUpload} />
      )}
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
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});