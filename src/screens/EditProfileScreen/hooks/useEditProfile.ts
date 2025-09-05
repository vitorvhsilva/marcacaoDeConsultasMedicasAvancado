import { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../../contexts/AuthContext';
import { imageService } from '../../../services/imageService';

export const useEditProfile = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [specialty, setSpecialty] = useState(user?.specialty || '');
  const [profileImage, setProfileImage] = useState(user?.image || '');
  const [loading, setLoading] = useState(false);

  const handleImageSelected = async (imageUri: string) => {
    try {
      setProfileImage(imageUri);

      if (imageUri.startsWith('data:image/') && user?.id) {
        const savedImageUri = await imageService.saveProfileImage(user.id, {
          uri: imageUri,
          base64: imageUri.split(',')[1],
          width: 150,
          height: 150,
        });
        setProfileImage(savedImageUri);
      }
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      Alert.alert('Erro', 'Não foi possível processar a imagem selecionada');
    }
  };

  const handleSaveProfile = async (onSuccess: () => void) => {
    try {
      setLoading(true);

      if (!name.trim() || !email.trim()) {
        Alert.alert('Erro', 'Nome e email são obrigatórios');
        return;
      }

      const updatedUser = {
        ...user!,
        name: name.trim(),
        email: email.trim(),
        image: profileImage,
        ...(user?.role === 'doctor' && { specialty: specialty.trim() }),
      };

      await updateUser(updatedUser);
      await AsyncStorage.setItem('@MedicalApp:user', JSON.stringify(updatedUser));

      if (user?.id) {
        await imageService.cleanupOldImages(user.id);
      }

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        { text: 'OK', onPress: onSuccess }
      ]);

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
    } finally {
      setLoading(false);
    }
  };

  return {
    name, setName,
    email, setEmail,
    specialty, setSpecialty,
    profileImage, setProfileImage,
    loading,
    handleImageSelected,
    handleSaveProfile
  };
};
