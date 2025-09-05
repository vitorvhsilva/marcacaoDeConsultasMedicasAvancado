import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appointment } from '../models/appointments';
import { User } from '../models/user';
import { statisticsService, Statistics } from '../../../services/statistics';

export const useAdminDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<Statistics | null>(null);

  const loadData = async () => {
    try {
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      if (storedAppointments) setAppointments(JSON.parse(storedAppointments));

      const storedUsers = await AsyncStorage.getItem('@MedicalApp:users');
      if (storedUsers) setUsers(JSON.parse(storedUsers));

      const stats = await statisticsService.getGeneralStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleUpdateStatus = async (appointmentId: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      if (storedAppointments) {
        const allAppointments: Appointment[] = JSON.parse(storedAppointments);
        const updatedAppointments = allAppointments.map(appointment =>
          appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
        );
        await AsyncStorage.setItem('@MedicalApp:appointments', JSON.stringify(updatedAppointments));
        loadData();
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  return { appointments, users, loading, statistics, handleUpdateStatus };
};
