import {
  Button,
  Carousel,
  Checkbox,
  Form,
  FormInstance,
  Input,
  Link,
  Message,
  Space,
} from '@arco-design/web-react';
import { IconLock, IconUser } from '@arco-design/web-react/icon';
import { useLocalStorageState, useMemoizedFn } from 'ahooks';
import React, { useRef, useState } from 'react';
import { useAsyncRequest } from '../model/utils';

/**
 * TODO: should allow to customize
 */
const banner = [
  {
    title: '涂山1',
    image:
      'http://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6c85f43aed61e320ebec194e6a78d6d3.png~tplv-uwbnlip3yd-png.png',
  },
  {
    title: '涂山2',
    image:
      'http://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6c85f43aed61e320ebec194e6a78d6d3.png~tplv-uwbnlip3yd-png.png',
  },
  {
    title: '涂山3',
    image:
      'http://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6c85f43aed61e320ebec194e6a78d6d3.png~tplv-uwbnlip3yd-png.png',
  },
];

export const LoginPage: React.FC = React.memo(() => {
  const formRef = useRef<FormInstance>(null);
  const [loginParams, setLoginParams] = useLocalStorageState<
    string | undefined
  >('loginParams');
  const [rememberPassword, setRememberPassword] = useState(!!loginParams);

  function afterLoginSuccess(params) {
    // 记住密码
    if (rememberPassword) {
      setLoginParams(JSON.stringify(params));
    } else {
      setLoginParams(undefined);
    }
    // 记录登录状态
    localStorage.setItem('userStatus', 'login');
    // 跳转首页
    window.location.href = '/';
  }

  const [{ loading, error }, handleLogin] = useAsyncRequest(
    async (params: any) => {
      // TODO
      console.log(params);
      Message.info(JSON.stringify(params));

      // afterLoginSuccess(params);
    }
  );

  const handleSubmitClick = useMemoizedFn(() => {
    if (!formRef.current) {
      return;
    }

    formRef.current.validate().then((values) => {
      handleLogin(values);
    });
  });

  return (
    <div className="flex h-screen">
      <div className="justify-center items-center flex h-full w-1/3">
        <Carousel
          className="h-full w-full bg-blue-800"
          animation="fade"
          autoPlay={true}
        >
          {banner.map((item, index) => (
            <div key={`${index}`}>
              <div className="flex flex-col justify-center items-center h-full">
                <div className="text-xl font-bold text-gray-200">
                  {item.title}
                </div>
                <img className="w-80" alt="banner-image" src={item.image} />
              </div>
            </div>
          ))}
        </Carousel>
      </div>
      <div className="flex flex-col flex-1 justify-center items-center">
        <div className="w-80">
          <div className="text-gray-800 text-2xl font-bold">Login to Admin</div>

          <div className="text-red-500 h-8 leading-8">{error?.message}</div>

          <Form
            layout="vertical"
            ref={formRef}
            initialValues={{ username: 'admin', password: 'admin' }}
          >
            <Form.Item
              field="username"
              rules={[{ required: true, message: 'Username is required' }]}
            >
              <Input
                prefix={<IconUser />}
                placeholder={'UserName'}
                onPressEnter={handleSubmitClick}
              />
            </Form.Item>
            <Form.Item
              field="password"
              rules={[{ required: true, message: 'Password is required' }]}
            >
              <Input.Password
                prefix={<IconLock />}
                placeholder={'Password'}
                onPressEnter={handleSubmitClick}
              />
            </Form.Item>

            <Space size={16} direction="vertical">
              <div>
                <Checkbox
                  checked={rememberPassword}
                  onChange={setRememberPassword}
                >
                  Remember password
                </Checkbox>
              </div>
              <Button
                type="primary"
                long
                onClick={handleSubmitClick}
                loading={loading}
              >
                Login
              </Button>
            </Space>
          </Form>
        </div>

        <div className="absolute bottom-0 p-2 text-gray-500">
          Powered by{' '}
          <Link
            type="text"
            href="https://github.com/msgbyte/tushan"
            target="_blank"
          >
            Tushan
          </Link>
        </div>
      </div>
    </div>
  );
});
LoginPage.displayName = 'LoginPage';