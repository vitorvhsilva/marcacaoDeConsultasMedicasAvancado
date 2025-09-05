import React, { useState } from 'react';
import { Input, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useAuth } from '../../contexts/AuthContext';
import * as S from './styles';
import theme from '../../styles/theme';

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

const RegisterScreen: React.FC = () => {
  const { register } = useAuth();
  const navigation = useNavigation<RegisterScreenProps['navigation']>();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setLoading(true);
    setError('');

    if (!name || !email || !password) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    try {
      await register({ name, email, password });
      navigation.navigate('Login');
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <S.Container>
      <S.Title>Cadastro de Paciente</S.Title>

      <S.InputWrapper>
        <Input
          placeholder="Nome completo"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      </S.InputWrapper>

      <S.InputWrapper>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </S.InputWrapper>

      <S.InputWrapper>
        <Input
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </S.InputWrapper>

      {error ? <S.ErrorText>{error}</S.ErrorText> : null}

      <S.ButtonWrapper>
        <Button
          title="Cadastrar"
          onPress={handleRegister}
          loading={loading}
          buttonStyle={{ backgroundColor: theme.colors.primary, paddingVertical: 12 }}
        />
      </S.ButtonWrapper>

      <S.ButtonWrapper>
        <Button
          title="Voltar para Login"
          onPress={() => navigation.navigate('Login')}
          buttonStyle={{ backgroundColor: theme.colors.secondary, paddingVertical: 12 }}
        />
      </S.ButtonWrapper>
    </S.Container>
  );
};

export default RegisterScreen;
