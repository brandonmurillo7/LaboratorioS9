
import React, { useState } from 'react';
import { StyleSheet, View, Button, Text, ActivityIndicator, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '../lib/storageClient';

export default function HomeScreen() {
  const [uploading, setUploading] = useState(false);

  const pickAndUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      
      if (result.canceled) return;

      setUploading(true);
      const file = result.assets[0];

      const response = await fetch(file.uri);
      const blob = await response.blob();

      const { error } = await supabase.storage
        .from('TU_NOMBRE_DE_BUCKET')
        .upload(file.name, blob, {
          contentType: file.mimeType || 'application/octet-stream',
          upsert: true,
        });

      if (error) throw error;
      Alert.alert('Éxito', 'Archivo subido correctamente');
   } catch (error: any) {

      console.log("--- ERROR DETALLADO ---");
      console.log(JSON.stringify(error, null, 2));
      
      Alert.alert('Error', error.message || 'Error desconocido');
    } finally {
   
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subir Archivo</Text>
      {uploading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Seleccionar y Subir" onPress={pickAndUpload} />
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