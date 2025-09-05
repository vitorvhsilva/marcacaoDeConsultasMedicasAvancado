import React from 'react';
import { ScrollView, ViewStyle, TextStyle, Alert } from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import Header from '../../components/Header';
import { useUsersManagement } from './hooks/useUserManagement';
import { User } from './models/user';
import * as S from './styles'

type Props = NativeStackNavigationProp<RootStackParamList, 'UserManagement'>;

const UserManagementScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<Props>();
  const { users, loading, deleteUser } = useUsersManagement(user?.id);

  const handleDelete = (id: string) => {
    Alert.alert(
      'Excluir Usuário',
      'Tem certeza que deseja excluir este usuário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteUser(id) },
      ]
    );
  };

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
      <ScrollView contentContainerStyle={S.styles.scrollContent}>
        <S.Title>Gerenciar Usuários</S.Title>

        <Button
          title="Adicionar Novo Usuário"
          onPress={() => navigation.navigate('CreateUser' as any)}
          containerStyle={S.styles.button as ViewStyle}
          buttonStyle={S.styles.buttonStyle}
        />

        {loading ? (
          <S.InfoText>Carregando usuários...</S.InfoText>
        ) : users.length === 0 ? (
          <S.InfoText>Nenhum usuário cadastrado</S.InfoText>
        ) : (
          users.map((u: User) => (
            <S.UserCard key={u.id}>
              <ListItem.Content>
                <ListItem.Title style={S.styles.userName as TextStyle}>{u.name}</ListItem.Title>
                <ListItem.Subtitle style={S.styles.userEmail as TextStyle}>{u.email}</ListItem.Subtitle>
                <S.RoleBadge role={u.role}><S.RoleText role={u.role}>{getRoleText(u.role)}</S.RoleText></S.RoleBadge>
                <S.ButtonContainer>
                  <Button
                    title="Editar"
                    onPress={() => navigation.navigate('EditUser' as any, { userId: u.id })}
                    containerStyle={S.styles.actionButton as ViewStyle}
                    buttonStyle={S.styles.editButton}
                  />
                  <Button
                    title="Excluir"
                    onPress={() => handleDelete(u.id)}
                    containerStyle={S.styles.actionButton as ViewStyle}
                    buttonStyle={S.styles.deleteButton}
                  />
                </S.ButtonContainer>
              </ListItem.Content>
            </S.UserCard>
          ))
        )}

        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          containerStyle={S.styles.button as ViewStyle}
          buttonStyle={S.styles.backButton}
        />
      </ScrollView>
    </S.Container>
  );
};

export default UserManagementScreen;
