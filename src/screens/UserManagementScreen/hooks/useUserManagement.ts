import { useState, useEffect, useCallback } from 'react';
import { User } from '../models/user';
import { userServiceManagement } from '../services/userManagementService';

export const useUsersManagement = (excludeUserId?: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedUsers = await userServiceManagement.getUsers(excludeUserId);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  }, [excludeUserId]);

  const deleteUser = async (userId: string) => {
    await userServiceManagement.deleteUser(userId);
    await loadUsers();
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return { users, loading, reload: loadUsers, deleteUser };
};
