import React from 'react';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Header';
import ProfileImagePicker from '../../components/ProfileImagePicker';
import { RootStackParamList } from '../../types/navigation';
import theme from '../../styles/theme';
import * as S from './styles';

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<ProfileScreenProps['navigation']>();

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'doctor': return 'Médico';
      case 'patient': return 'Paciente';
      default: return role;
    }
  };

  return (
    <S.Container>
      <Header />
      <S.Scroll>
        <S.Title>Meu Perfil</S.Title>

        <S.ProfileCard>
          <ProfileImagePicker
            currentImageUri={user?.image}
            onImageSelected={() => {}}
            size={120}
            editable={false}
          />
          <S.Name>{user?.name}</S.Name>
          <S.Email>{user?.email}</S.Email>
          <S.RoleBadge role={user?.role || ''}>
            <S.RoleText>{getRoleText(user?.role || '')}</S.RoleText>
          </S.RoleBadge>
          {user?.role === 'doctor' && (
            <S.SpecialtyText>Especialidade: {user?.specialty}</S.SpecialtyText>
          )}
        </S.ProfileCard>

        <S.ButtonContainer>
          <Button
            title="Editar Perfil"
            onPress={() => navigation.navigate('EditProfile' as any)}
            buttonStyle={{ backgroundColor: theme.colors.success, paddingVertical: 12 }}
          />
        </S.ButtonContainer>

        <S.ButtonContainer>
          <Button
            title="Voltar"
            onPress={() => navigation.goBack()}
            buttonStyle={{ backgroundColor: theme.colors.primary, paddingVertical: 12 }}
          />
        </S.ButtonContainer>

        <S.ButtonContainer>
          <Button
            title="Sair"
            onPress={signOut}
            buttonStyle={{ backgroundColor: theme.colors.error, paddingVertical: 12 }}
          />
        </S.ButtonContainer>
      </S.Scroll>
    </S.Container>
  );
};

export default ProfileScreen;
