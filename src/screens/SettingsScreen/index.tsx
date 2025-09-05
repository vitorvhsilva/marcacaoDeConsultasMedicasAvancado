import React, { useState, useCallback } from 'react';
import { Alert, Share } from 'react-native';
import { Button, ListItem, Switch } from 'react-native-elements';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { storageService } from '../../services/storage';
import theme from '../../styles/theme';
import Header from '../../components/Header';
import * as S from './styles';

interface AppSettings {
  notifications: boolean;
  autoBackup: boolean;
  theme: 'light' | 'dark';
  language: string;
}

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

const SettingsScreen: React.FC = () => {
  const { signOut } = useAuth();
  const navigation = useNavigation<SettingsScreenProps['navigation']>();
  
  const [settings, setSettings] = useState<AppSettings>({
    notifications: true,
    autoBackup: true,
    theme: 'light',
    language: 'pt-BR',
  });
  const [loading, setLoading] = useState(true);
  const [storageInfo, setStorageInfo] = useState<any>(null);

  const loadSettings = useCallback(async () => {
    try {
      const appSettings = await storageService.getAppSettings();
      setSettings(appSettings);

      const info = await storageService.getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [loadSettings])
  );

  const updateSetting = async (key: keyof AppSettings, value: any) => {
    try {
      const updated = { ...settings, [key]: value };
      setSettings(updated);
      await storageService.updateAppSettings({ [key]: value });
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a configuração');
    }
  };

  const handleCreateBackup = async () => {
    try {
      setLoading(true);
      const backup = await storageService.createBackup();
      const fileName = `backup_${new Date().toISOString().split('T')[0]}.json`;

      await Share.share({ message: backup, title: `Backup do App - ${fileName}` });
      Alert.alert('Sucesso', 'Backup criado e compartilhado com sucesso!');
    } catch {
      Alert.alert('Erro', 'Não foi possível criar o backup');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = () => {
    Alert.alert('Limpar Cache', 'Isso irá limpar o cache da aplicação. Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Limpar',
        style: 'destructive',
        onPress: async () => {
          try {
            await storageService.clearCache();
            await loadSettings();
            Alert.alert('Sucesso', 'Cache limpo com sucesso!');
          } catch {
            Alert.alert('Erro', 'Não foi possível limpar o cache');
          }
        },
      },
    ]);
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Apagar Todos os Dados',
      'Isso apagará TODOS os dados da aplicação permanentemente!',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'APAGAR TUDO',
          style: 'destructive',
          onPress: () =>
            Alert.alert(
              'Confirmação Final',
              'Tem certeza absoluta? Todos os dados serão perdidos!',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'SIM, APAGAR',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await storageService.clearAll();
                      Alert.alert('Concluído', 'Todos os dados foram apagados.', [
                        { text: 'OK', onPress: signOut },
                      ]);
                    } catch {
                      Alert.alert('Erro', 'Não foi possível apagar os dados');
                    }
                  },
                },
              ]
            ),
        },
      ]
    );
  };

  if (loading) {
    return (
      <S.Container>
        <Header />
        <S.LoadingContainer>
          <S.LoadingText>Carregando configurações...</S.LoadingText>
        </S.LoadingContainer>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <Header />
      <S.ScrollContainer>
        <S.Title>Configurações</S.Title>

        <S.SectionTitle>Preferências</S.SectionTitle>
        <S.SettingsCard>
          <ListItem>
            <ListItem.Content>
              <ListItem.Title>Notificações</ListItem.Title>
              <ListItem.Subtitle>Receber notificações push</ListItem.Subtitle>
            </ListItem.Content>
            <Switch
              value={settings.notifications}
              onValueChange={(v) => updateSetting('notifications', v)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            />
          </ListItem>

          <ListItem>
            <ListItem.Content>
              <ListItem.Title>Backup Automático</ListItem.Title>
              <ListItem.Subtitle>Criar backups automaticamente</ListItem.Subtitle>
            </ListItem.Content>
            <Switch
              value={settings.autoBackup}
              onValueChange={(v) => updateSetting('autoBackup', v)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            />
          </ListItem>
        </S.SettingsCard>

        <S.SectionTitle>Dados e Armazenamento</S.SectionTitle>
        <S.SettingsCard>
          {storageInfo && (
            <>
              <S.InfoItem>
                <S.InfoLabel>Itens no Cache:</S.InfoLabel>
                <S.InfoValue>{storageInfo.cacheSize}</S.InfoValue>
              </S.InfoItem>
              <S.InfoItem>
                <S.InfoLabel>Total de Chaves:</S.InfoLabel>
                <S.InfoValue>{storageInfo.totalKeys}</S.InfoValue>
              </S.InfoItem>
            </>
          )}
        </S.SettingsCard>

        <S.ButtonWrapper>
          <Button title="Criar Backup" onPress={handleCreateBackup} loading={loading} buttonStyle={{ backgroundColor: theme.colors.success, paddingVertical: 12 }} />
        </S.ButtonWrapper>

        <S.ButtonWrapper>
          <Button title="Limpar Cache" onPress={handleClearCache} buttonStyle={{ backgroundColor: theme.colors.warning, paddingVertical: 12 }} />
        </S.ButtonWrapper>

        <S.SectionTitle>Ações Perigosas</S.SectionTitle>
        <S.ButtonWrapper>
          <Button title="Apagar Todos os Dados" onPress={handleClearAllData} buttonStyle={{ backgroundColor: theme.colors.error, paddingVertical: 12 }} />
        </S.ButtonWrapper>

        <S.ButtonWrapper>
          <Button title="Voltar" onPress={() => navigation.goBack()} buttonStyle={{ backgroundColor: theme.colors.primary, paddingVertical: 12 }} />
        </S.ButtonWrapper>
      </S.ScrollContainer>
    </S.Container>
  );
};

export default SettingsScreen;
