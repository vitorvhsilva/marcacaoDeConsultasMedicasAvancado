import React from 'react';
import { ScrollView, ViewStyle } from 'react-native';
import { Button, ListItem, Badge } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../components/Header';
import * as S from './styles';
import { RootStackParamList } from '../../types/navigation';
import theme from '../../styles/theme';
import { useNotifications } from './hooks/useNotifications';

type NotificationsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Notifications'>;
};

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<NotificationsScreenProps['navigation']>();
  const {
    notifications,
    loading,
    loadNotifications,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDeleteNotification
  } = useNotifications();

  React.useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment_confirmed': return '✅';
      case 'appointment_cancelled': return '❌';
      case 'appointment_reminder': return '⏰';
      default: return '📩';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <S.Container>
      <Header />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <S.TitleContainer>
          <S.Title>Notificações</S.Title>
          {unreadCount > 0 && <Badge value={unreadCount} status="error" containerStyle={{ marginLeft: 8 }} />}
        </S.TitleContainer>

        {unreadCount > 0 && (
          <Button
            title="Marcar todas como lidas"
            onPress={handleMarkAllAsRead}
            containerStyle={{ marginBottom: 15, width: '100%' } as ViewStyle}
            buttonStyle={{ backgroundColor: theme.colors.success, paddingVertical: 10 }}
          />
        )}

        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          containerStyle={{ marginBottom: 20, width: '100%' } as ViewStyle}
          buttonStyle={{ backgroundColor: theme.colors.primary, paddingVertical: 12 }}
        />

        {loading ? (
          <S.LoadingText>Carregando notificações...</S.LoadingText>
        ) : notifications.length === 0 ? (
          <S.EmptyContainer>
            <S.EmptyText>Nenhuma notificação encontrada</S.EmptyText>
          </S.EmptyContainer>
        ) : (
          notifications.map((notification) => (
            <S.NotificationCard key={notification.id} isRead={notification.read}>
              <ListItem
                onPress={() => !notification.read && handleMarkAsRead(notification.id)}
                onLongPress={() => handleDeleteNotification(notification.id)}
              >
                <S.NotificationIcon>{getNotificationIcon(notification.type)}</S.NotificationIcon>
                <ListItem.Content>
                  <S.NotificationHeader>
                    <ListItem.Title style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text }}>
                      {notification.title}
                    </ListItem.Title>
                    {!notification.read && <S.UnreadDot />}
                  </S.NotificationHeader>
                  <ListItem.Subtitle style={{ fontSize: 14, color: theme.colors.text, marginTop: 4, lineHeight: 20 }}>
                    {notification.message}
                  </ListItem.Subtitle>
                  <S.DateText>{formatDate(notification.createdAt)}</S.DateText>
                </ListItem.Content>
              </ListItem>
            </S.NotificationCard>
          ))
        )}
      </ScrollView>
    </S.Container>
  );
};

export default NotificationsScreen;
