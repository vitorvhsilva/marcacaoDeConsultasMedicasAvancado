import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appointment } from '../models/appointments';
import { useAuth } from '../../../contexts/AuthContext';
import { statisticsService, Statistics } from '../../../services/statistics';
import { notificationService } from '../../../services/notifications';
import { useFocusEffect } from '@react-navigation/native';

export const useDoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<Partial<Statistics> | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [actionType, setActionType] = useState<'confirm' | 'cancel'>('confirm');

  const loadAppointments = async () => {
    try {
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      if (storedAppointments) {
        const allAppointments: Appointment[] = JSON.parse(storedAppointments);
        const doctorAppointments = allAppointments.filter(
          (appointment) => appointment.doctorId === user?.id
        );
        setAppointments(doctorAppointments);

        if (user?.id) {
          const stats = await statisticsService.getDoctorStatistics(user.id);
          setStatistics(stats);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (appointment: Appointment, action: 'confirm' | 'cancel') => {
    setSelectedAppointment(appointment);
    setActionType(action);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedAppointment(null);
  };

  const handleConfirmAction = async (reason?: string) => {
    if (!selectedAppointment) return;

    try {
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      if (storedAppointments) {
        const allAppointments: Appointment[] = JSON.parse(storedAppointments);
        const updatedAppointments = allAppointments.map(appointment => {
          if (appointment.id === selectedAppointment.id) {
            return { 
              ...appointment, 
              status: actionType === 'confirm' ? 'confirmed' : 'cancelled',
              ...(reason && { cancelReason: reason })
            };
          }
          return appointment;
        });
        await AsyncStorage.setItem('@MedicalApp:appointments', JSON.stringify(updatedAppointments));

        if (actionType === 'confirm') {
          await notificationService.notifyAppointmentConfirmed(selectedAppointment.patientId, selectedAppointment);
        } else {
          await notificationService.notifyAppointmentCancelled(selectedAppointment.patientId, selectedAppointment, reason);
        }

        loadAppointments();
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  useFocusEffect(useCallback(() => {
    loadAppointments();
  }, []));

  return {
    appointments,
    loading,
    statistics,
    modalVisible,
    selectedAppointment,
    actionType,
    handleOpenModal,
    handleCloseModal,
    handleConfirmAction,
  };
};
