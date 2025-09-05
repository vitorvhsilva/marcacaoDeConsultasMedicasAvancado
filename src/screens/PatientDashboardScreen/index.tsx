import React, { useState } from 'react';
import { ScrollView, ViewStyle, TextStyle } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import { RootStackParamList } from '../../types/navigation';
import { Appointment } from './models/appointments';
import theme from '../../styles/theme';
import * as S from './styles';

type PatientDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PatientDashboard'>;
};

const PatientDashboardScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<PatientDashboardScreenProps['navigation']>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      if (storedAppointments) {
        const allAppointments: Appointment[] = JSON.parse(storedAppointments);
        setAppointments(allAppointments.filter(a => a.patientId === user?.id));
      }
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadAppointments();
    }, [])
  );

  return (
    <S.Container>
      <Header />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <S.Title>Minhas Consultas</S.Title>

        <Button
          title="Agendar Nova Consulta"
          onPress={() => navigation.navigate('CreateAppointment')}
          containerStyle={{ marginBottom: 20, width: '100%' } as ViewStyle}
          buttonStyle={{ backgroundColor: theme.colors.primary, paddingVertical: 12 }}
        />

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

        {loading ? (
          <S.LoadingText>Carregando consultas...</S.LoadingText>
        ) : appointments.length === 0 ? (
          <S.EmptyText>Nenhuma consulta agendada</S.EmptyText>
        ) : (
          appointments.map((appointment) => (
            <S.AppointmentCard key={appointment.id}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.text } as TextStyle}>
                Paciente: {appointment.patientName}
              </Text>
              <Text style={{ fontSize: 14, color: theme.colors.text, marginTop: 4 } as TextStyle}>
                {appointment.date} às {appointment.time}
              </Text>
              <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text, marginTop: 4 } as TextStyle}>
                {appointment.doctorName}
              </Text>
              <Text style={{ fontSize: 14, color: theme.colors.text, marginTop: 4 } as TextStyle}>
                {appointment.specialty}
              </Text>
              <S.StatusBadge status={appointment.status}>
                <S.StatusText status={appointment.status}>
                  {appointment.status === 'confirmed'
                    ? 'Confirmada'
                    : appointment.status === 'cancelled'
                    ? 'Cancelada'
                    : 'Pendente'}
                </S.StatusText>
              </S.StatusBadge>
            </S.AppointmentCard>
          ))
        )}

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

export default PatientDashboardScreen;
