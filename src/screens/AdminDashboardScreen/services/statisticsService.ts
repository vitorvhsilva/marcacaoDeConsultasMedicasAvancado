import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appointment } from '../models/appointments';
import { User } from '../models/user';

export interface Statistics {
  totalAppointments: number;
  confirmedAppointments: number;
  totalPatients: number;
  totalDoctors: number;
  statusPercentages: {
    confirmed: number;
    cancelled: number;
    pending: number;
  };
  specialties: Record<string, number>;
}

export const statisticsService = {
  getGeneralStatistics: async (): Promise<Statistics> => {
    try {
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      const storedUsers = await AsyncStorage.getItem('@MedicalApp:users');

      const appointments: Appointment[] = storedAppointments ? JSON.parse(storedAppointments) : [];
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

      const totalAppointments = appointments.length;
      const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length;

      const totalPatients = users.filter(u => u.role === 'patient').length;
      const totalDoctors = users.filter(u => u.role === 'doctor').length;

      const statusCounts = {
        confirmed: appointments.filter(a => a.status === 'confirmed').length,
        cancelled: appointments.filter(a => a.status === 'cancelled').length,
        pending: appointments.filter(a => a.status === 'pending').length,
      };

      const statusPercentages = {
        confirmed: totalAppointments ? (statusCounts.confirmed / totalAppointments) * 100 : 0,
        cancelled: totalAppointments ? (statusCounts.cancelled / totalAppointments) * 100 : 0,
        pending: totalAppointments ? (statusCounts.pending / totalAppointments) * 100 : 0,
      };

      const specialties: Record<string, number> = {};
      appointments.forEach(a => {
        specialties[a.specialty] = (specialties[a.specialty] || 0) + 1;
      });

      return {
        totalAppointments,
        confirmedAppointments,
        totalPatients,
        totalDoctors,
        statusPercentages,
        specialties,
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      return {
        totalAppointments: 0,
        confirmedAppointments: 0,
        totalPatients: 0,
        totalDoctors: 0,
        statusPercentages: { confirmed: 0, cancelled: 0, pending: 0 },
        specialties: {},
      };
    }
  },
};
