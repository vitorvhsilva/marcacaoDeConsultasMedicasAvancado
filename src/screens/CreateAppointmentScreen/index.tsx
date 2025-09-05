import React from 'react';
import { ScrollView, ViewStyle } from 'react-native';
import { Input, Button } from 'react-native-elements';
import theme from '../../styles/theme';
import Header from '../../components/Header';
import DoctorList from '../../components/DoctorList';
import TimeSlotList from '../../components/TimeSlotList';
import { useCreateAppointment } from './hooks/useCreateAppointment';
import { Doctor } from './models/doctors';
import * as S from './styles';

const availableDoctors: Doctor[] = [
  { id: '1', name: 'Dr. João Silva', specialty: 'Cardiologia', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: '2', name: 'Dra. Maria Santos', specialty: 'Pediatria', image: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { id: '3', name: 'Dr. Pedro Oliveira', specialty: 'Ortopedia', image: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { id: '4', name: 'Dra. Ana Costa', specialty: 'Dermatologia', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: '5', name: 'Dr. Carlos Mendes', specialty: 'Oftalmologia', image: 'https://randomuser.me/api/portraits/men/3.jpg' },
];

const CreateAppointmentScreen: React.FC = () => {
  const {
    date, setDate,
    selectedTime, setSelectedTime,
    selectedDoctor, setSelectedDoctor,
    loading, error, handleCreateAppointment
  } = useCreateAppointment();

  return (
    <S.Container>
      <Header />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <S.Title>Agendar Consulta</S.Title>

        <Input
          placeholder="Data (DD/MM/AAAA)"
          value={date}
          onChangeText={setDate}
          containerStyle={{ marginBottom: 15 }}
          keyboardType="numeric"
        />

        <S.SectionTitle>Selecione um Horário</S.SectionTitle>
        <TimeSlotList onSelectTime={setSelectedTime} selectedTime={selectedTime} />

        <S.SectionTitle>Selecione um Médico</S.SectionTitle>
        <DoctorList doctors={availableDoctors} onSelectDoctor={setSelectedDoctor} selectedDoctorId={selectedDoctor?.id} />

        {error ? <S.ErrorText>{error}</S.ErrorText> : null}

        <Button
          title="Agendar"
          onPress={handleCreateAppointment}
          loading={loading}
          containerStyle={{ marginTop: 10, width: '100%' } as ViewStyle}
          buttonStyle={{ backgroundColor: theme.colors.primary, paddingVertical: 12 }}
        />

        <Button
          title="Cancelar"
          onPress={() => window.history.back()}
          containerStyle={{ marginTop: 10, width: '100%' } as ViewStyle}
          buttonStyle={{ backgroundColor: theme.colors.secondary, paddingVertical: 12 }}
        />
      </ScrollView>
    </S.Container>
  );
};

export default CreateAppointmentScreen;
