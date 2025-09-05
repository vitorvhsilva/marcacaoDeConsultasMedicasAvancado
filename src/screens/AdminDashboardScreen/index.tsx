import React from 'react';
import { ScrollView, ViewStyle, TextStyle } from 'react-native';
import { Button, ListItem, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Header';
import StatisticsCard from '../../components/StatisticsCard';
import { useAdminDashboard } from './hooks/useAdminDashboard';
import theme from '../../styles/theme';
import * as S from './styles';
import { Appointment } from './models/appointments';

type AdminDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AdminDashboard'>;
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'confirmed': return 'Confirmada';
    case 'cancelled': return 'Cancelada';
    default: return 'Pendente';
  }
};

const AdminDashboardScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<AdminDashboardScreenProps['navigation']>();
  const { appointments, users, loading, statistics, handleUpdateStatus } = useAdminDashboard();

  return (
    <S.Container>
      <Header />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <S.Title>Painel Administrativo</S.Title>

        <Button
          title="Gerenciar Usuários"
          onPress={() => navigation.navigate('UserManagement')}
          containerStyle={{ marginBottom: 20, width: '100%' } as ViewStyle}
          buttonStyle={{ backgroundColor: theme.colors.primary, paddingVertical: 12 }}
        />
        <Button
          title="Meu Perfil"
          onPress={() => navigation.navigate('Profile')}
          containerStyle={{ marginBottom: 20, width: '100%' } as ViewStyle}
          buttonStyle={{ backgroundColor: theme.colors.primary, paddingVertical: 12 }}
        />

        <S.SectionTitle>Estatísticas Gerais</S.SectionTitle>
        {statistics && (
          <S.StatisticsGrid>
            <StatisticsCard title="Total de Consultas" value={statistics.totalAppointments} color={theme.colors.primary} subtitle="Todas as consultas" />
            <StatisticsCard title="Consultas Confirmadas" value={statistics.confirmedAppointments} color={theme.colors.success} subtitle={`${statistics.statusPercentages.confirmed.toFixed(1)}% do total`} />
            <StatisticsCard title="Pacientes Ativos" value={statistics.totalPatients} color={theme.colors.secondary} subtitle="Pacientes únicos" />
            <StatisticsCard title="Médicos Ativos" value={statistics.totalDoctors} color={theme.colors.warning} subtitle="Médicos com consultas" />
          </S.StatisticsGrid>
        )}

        <S.SectionTitle>Últimas Consultas</S.SectionTitle>
        {loading ? (
          <S.LoadingText>Carregando dados...</S.LoadingText>
        ) : appointments.length === 0 ? (
          <S.EmptyText>Nenhuma consulta agendada</S.EmptyText>
        ) : appointments.map((appointment: Appointment) => (
          <S.AppointmentCard key={appointment.id}>
            <ListItem.Content>
              <ListItem.Title style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text } as TextStyle}>
                {appointment.doctorName}
              </ListItem.Title>
              <ListItem.Subtitle style={{ fontSize: 14, color: theme.colors.text, marginTop: 4 } as TextStyle}>
                {appointment.specialty}
              </ListItem.Subtitle>
              <Text style={{ fontSize: 14, color: theme.colors.text, marginTop: 4 } as TextStyle}>
                {appointment.date} às {appointment.time}
              </Text>
              <S.StatusBadge status={appointment.status}>
                <S.StatusText status={appointment.status}>{getStatusText(appointment.status)}</S.StatusText>
              </S.StatusBadge>
              {appointment.status === 'pending' && (
                <S.ButtonContainer>
                  <Button
                    title="Confirmar"
                    onPress={() => handleUpdateStatus(appointment.id, 'confirmed')}
                    containerStyle={{ marginTop: 8, width: '48%' } as ViewStyle}
                    buttonStyle={{ backgroundColor: theme.colors.success, paddingVertical: 8 }}
                  />
                  <Button
                    title="Cancelar"
                    onPress={() => handleUpdateStatus(appointment.id, 'cancelled')}
                    containerStyle={{ marginTop: 8, width: '48%' } as ViewStyle}
                    buttonStyle={{ backgroundColor: theme.colors.error, paddingVertical: 8 }}
                  />
                </S.ButtonContainer>
              )}
            </ListItem.Content>
          </S.AppointmentCard>
        ))}

        <Button
          title="Sair"
          onPress={signOut}
          containerStyle={{ marginBottom: 20, width: '100%' } as ViewStyle}
          buttonStyle={{ backgroundColor: theme.colors.error, paddingVertical: 12 }}
        />
      </ScrollView>
    </S.Container>
  );
};

export default AdminDashboardScreen;
