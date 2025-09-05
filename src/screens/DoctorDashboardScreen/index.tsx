import React from 'react';
import { ScrollView, ViewStyle, TextStyle } from 'react-native';
import { Button, ListItem, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../components/Header';
import StatisticsCard from '../../components/StatisticsCard';
import AppointmentActionModal from '../../components/AppointmentActionModal';
import { useAuth } from '../../contexts/AuthContext';
import { useDoctorDashboard } from './hooks/useDoctorDashboard';
import * as S from './styles';
import theme from '../../styles/theme';
import { RootStackParamList } from '../../types/navigation';

type DoctorDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DoctorDashboard'>;
};

const DoctorDashboardScreen: React.FC = () => {
  const { signOut, user } = useAuth();
  const navigation = useNavigation<DoctorDashboardScreenProps['navigation']>();
  const {
    appointments, loading, statistics,
    modalVisible, selectedAppointment, actionType,
    handleOpenModal, handleCloseModal, handleConfirmAction
  } = useDoctorDashboard();

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'cancelled': return 'Cancelada';
      default: return 'Pendente';
    }
  };

  return (
    <S.Container>
      <Header />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <S.Title>Minhas Consultas</S.Title>

        <Button
          title="Meu Perfil"
          onPress={() => navigation.navigate('Profile')}
          containerStyle={{ marginBottom: 20, width: '100%' } as ViewStyle}
          buttonStyle={{ backgroundColor: theme.colors.primary, paddingVertical: 12 }}
        />

        <Button
          title="Configurações"
          onPress={() => navigation.navigate('Settings')}
          containerStyle={{ marginBottom: 20, width: '100%' } as ViewStyle}
          buttonStyle={{ backgroundColor: theme.colors.secondary, paddingVertical: 12 }}
        />

        <S.SectionTitle>Estatísticas Gerais</S.SectionTitle>
        {statistics && (
          <S.StatisticsGrid>
            <StatisticsCard title="Total de Consultas" value={statistics.totalAppointments ?? 0} color={theme.colors.primary} subtitle="Todas as consultas"/>
            <StatisticsCard title="Consultas Confirmadas" value={statistics.confirmedAppointments ?? 0} color={theme.colors.success} subtitle={`${(statistics.statusPercentages?.confirmed ?? 0).toFixed(1)}% do total`}/>
            <StatisticsCard title="Consultas Canceladas" value={statistics.cancelledAppointments ?? 0} color={theme.colors.error} subtitle={`${(statistics.statusPercentages?.pending ?? 0).toFixed(1)}% do total`}/>
            <StatisticsCard title="Pacientes Atendidos" value={statistics.totalPatients ?? 0} color={theme.colors.secondary} subtitle="Pacientes únicos"/>
          </S.StatisticsGrid>
        )}

        <S.SectionTitle>Últimas Consultas</S.SectionTitle>
        {loading ? (
          <S.LoadingText>Carregando consultas...</S.LoadingText>
        ) : appointments.length === 0 ? (
          <S.EmptyText>Nenhuma consulta agendada</S.EmptyText>
        ) : (
          appointments.map((appointment) => (
            <S.AppointmentCard key={appointment.id}>
              <ListItem.Content>
                <ListItem.Title style={{ fontSize: 16, fontWeight: '700', color: theme.colors.text } as TextStyle}>
                  Paciente: {appointment.patientName || 'Nome não disponível'}
                </ListItem.Title>
                <ListItem.Subtitle style={{ fontSize: 16, fontWeight: '700', color: theme.colors.text } as TextStyle}>
                  {appointment.date} às {appointment.time}
                </ListItem.Subtitle>
                <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.text } as TextStyle}>
                  {appointment.specialty}
                </Text>
                <S.StatusBadge status={appointment.status}>
                  <S.StatusText status={appointment.status}>
                    {getStatusText(appointment.status)}
                  </S.StatusText>
                </S.StatusBadge>
                {appointment.status === 'pending' && (
                  <S.ButtonContainer>
                    <Button
                      title="Confirmar"
                      onPress={() => handleOpenModal(appointment, 'confirm')}
                      containerStyle={{ marginTop: 8, width: '48%' } as ViewStyle}
                      buttonStyle={{ backgroundColor: theme.colors.success, paddingVertical: 8 }}
                    />
                    <Button
                      title="Cancelar"
                      onPress={() => handleOpenModal(appointment, 'cancel')}
                      containerStyle={{ marginTop: 8, width: '48%' } as ViewStyle}
                      buttonStyle={{ backgroundColor: theme.colors.error, paddingVertical: 8 }}
                    />
                  </S.ButtonContainer>
                )}
              </ListItem.Content>
            </S.AppointmentCard>
          ))
        )}

        <Button
          title="Sair"
          onPress={signOut}
          containerStyle={{ marginBottom: 20, width: '100%' } as ViewStyle}
          buttonStyle={{ backgroundColor: theme.colors.error, paddingVertical: 12 }}
        />

        {selectedAppointment && (
          <AppointmentActionModal
            visible={modalVisible}
            onClose={handleCloseModal}
            onConfirm={handleConfirmAction}
            actionType={actionType}
            appointmentDetails={{
              patientName: selectedAppointment.patientName,
              doctorName: selectedAppointment.doctorName,
              date: selectedAppointment.date,
              time: selectedAppointment.time,
              specialty: selectedAppointment.specialty,
            }}
          />
        )}
      </ScrollView>
    </S.Container>
  );
};

export default DoctorDashboardScreen;
