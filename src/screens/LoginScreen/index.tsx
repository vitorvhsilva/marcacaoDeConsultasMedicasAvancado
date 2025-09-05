import React from 'react';
import { Input, Button, Text } from 'react-native-elements';
import { ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import theme from '../../styles/theme';
import { useLogin } from './hooks/useLogin';
import * as S from './styles';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenProps['navigation']>();
  const { email, setEmail, password, setPassword, loading, error, handleLogin } = useLogin();

  return (
    <S.Container>
      <S.Title>App Marcação de Consultas</S.Title>

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        containerStyle={{ marginBottom: 15 }}
      />

      <Input
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        containerStyle={{ marginBottom: 15 }}
      />

      {error ? <S.ErrorText>{error}</S.ErrorText> : null}

      <Button
        title="Entrar"
        onPress={handleLogin}
        loading={loading}
        containerStyle={{ marginTop: 10, width: '100%' } as ViewStyle}
        buttonStyle={{ backgroundColor: theme.colors.primary, paddingVertical: 12 }}
      />

      <Button
        title="Cadastrar Novo Paciente"
        onPress={() => navigation.navigate('Register')}
        containerStyle={{ marginTop: 10, width: '100%' } as ViewStyle}
        buttonStyle={{ backgroundColor: theme.colors.secondary, paddingVertical: 12 }}
      />

      <Text style={{ marginTop: 20, textAlign: 'center', color: theme.colors.text }}>
        Use as credenciais de exemplo:
      </Text>
      <Text style={{ marginTop: 10, textAlign: 'center', color: theme.colors.text, fontSize: 12 }}>
        Admin: admin@example.com / 123456{'\n'}
        Médicos: joao@example.com, maria@example.com, pedro@example.com / 123456
      </Text>
    </S.Container>
  );
};

export default LoginScreen;
