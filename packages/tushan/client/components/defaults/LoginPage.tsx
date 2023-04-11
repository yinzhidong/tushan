import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Message,
} from '@arco-design/web-react';
import { IconLock } from '@arco-design/web-react/icon';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { useCheckAuth } from '../../api/auth';
import useLogin from '../../api/auth/useLogin';
import { useEvent } from '../../hooks/useEvent';
import { useSafeSetState } from '../../hooks/useSafeState';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 1px;
  align-items: center;
  justify-content: flex-start;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: radial-gradient(
    circle at 50% 14em,
    rgb(49, 50, 100) 0%,
    rgb(0, 2, 59) 60%,
    rgb(0, 2, 59) 100%
  );

  .main {
    min-width: 300px;
    margin-top: 6em;

    .header {
      margin: 1em;
      display: flex;
      justify-content: center;
    }
  }
`;

export const LoginPage: React.FC = React.memo(() => {
  const checkAuth = useCheckAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth({}, false)
      .then(() => {
        // already authenticated, redirect to the home page
        navigate('/');
      })
      .catch(() => {
        // not authenticated, stay on the login page
      });
  }, [checkAuth, navigate]);

  return (
    <Root>
      <Card className="main">
        <div className="header">
          <Avatar>
            <IconLock />
          </Avatar>
        </div>

        <LoginForm />
      </Card>
    </Root>
  );
});
LoginPage.displayName = 'LoginPage';

const StyledForm = styled(Form)``;

const LoginForm: React.FC = React.memo(() => {
  const [loading, setLoading] = useSafeSetState(false);
  const login = useLogin();

  const submit = useEvent(async (values) => {
    setLoading(true);

    try {
      await login(values);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      Message.error('Login Failed');
      console.error(e);
    }
  });

  return (
    <StyledForm layout="vertical" onSubmit={submit}>
      <Form.Item label="Username" field="username">
        <Input autoComplete="username" />
      </Form.Item>
      <Form.Item label="Password" field="password">
        <Input.Password autoComplete="password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} long={true}>
          Login
        </Button>
      </Form.Item>

      {/* <CardContent>
        <TextInput
          autoFocus
          source="username"
          label={translate('ra.auth.username')}
          autoComplete="username"
          validate={required()}
          fullWidth
        />
        <TextInput
          source="password"
          label={translate('ra.auth.password')}
          type="password"
          autoComplete="current-password"
          validate={required()}
          fullWidth
        />

        <Button
          variant="contained"
          type="submit"
          color="primary"
          disabled={loading}
          fullWidth
          className={LoginFormClasses.button}
        >
          {loading ? (
            <CircularProgress
              className={LoginFormClasses.icon}
              size={19}
              thickness={3}
            />
          ) : (
            translate('ra.auth.sign_in')
          )}
        </Button>
      </CardContent> */}
    </StyledForm>
  );
});
LoginForm.displayName = 'LoginForm';
