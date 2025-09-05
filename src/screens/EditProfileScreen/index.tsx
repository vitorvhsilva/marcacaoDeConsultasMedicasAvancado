import React from 'react';
import { ScrollView, ViewStyle } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../components/Header';
import ProfileImagePicker from '../../components/ProfileImagePicker';
import { useEditProfile } from './hooks/useEditProfile';
import * as S from './styles';
import { RootStackParamList } from '../../types/navigation';
import theme from '../../styles/theme';

type EditProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;
};

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<EditProfileScreenProps['navigation']>();
  const {
    name, setName,
    email, setEmail,
    specialty, setSpecialty,
    profileImage,
    loading,
    handleImageSelected,
    handleSaveProfile
  } = useEditProfile();

  return (
    <S.Container>
      <Header />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <S.Title>Editar Perfil</S.Title>

        <S.ProfileCard>
          <ProfileImagePicker
            currentImageUri={profileImage}
            onImageSelected={handleImageSelected}
            size={120}
            editable
          />

          <Input
            label="Nome"
            value={name}
            onChangeText={setName}
            containerStyle={{ marginBottom: 15 }}
            placeholder="Digite seu nome"
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            containerStyle={{ marginBottom: 15 }}
            placeholder="Digite seu email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {true && (  
            <Input
              label="Especialidade"
              value={specialty}
              onChangeText={setSpecialty}
              containerStyle={{ marginBottom: 15 }}
              placeholder="Digite sua especialidade"
            />
          )}

          <S.RoleBadge role="doctor">
            <S.RoleText>Médico</S.RoleText>
          </S.RoleBadge>
        </S.ProfileCard>

        <Button
          title="Salvar Alterações"
          onPress={() => handleSaveProfile(() => navigation.goBack())}
          loading={loading}
          containerStyle={{ marginBottom: 15, width: '100%' } as ViewStyle}
          buttonStyle={{ backgroundColor: theme.colors.success, paddingVertical: 12 }}
        />

        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          containerStyle={{ marginBottom: 15, width: '100%' } as ViewStyle}
          buttonStyle={{ backgroundColor: theme.colors.secondary, paddingVertical: 12 }}
        />
      </ScrollView>
    </S.Container>
  );
};

export default EditProfileScreen;
