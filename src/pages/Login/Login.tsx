import {Button, Form, Input, Typography} from "antd";
import {useContext, useState} from "react";
import {useLogin, useNotification} from "@refinedev/core";
import axios from "axios";
import styles from './login.module.css'
import classNames from 'classnames/bind'
import {API_URL} from "../../constants/url";
import {emailRegex} from "../../constants/regexp";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthProvider";

const {Link} = Typography

const cx = classNames.bind(styles)

export const validateEmail = (
  rule: unknown,
  value: string,
  callback: (error?: string) => void
) => {
  if (!value || emailRegex.test(value)) {
    callback()
  } else {
    callback('Введите корректный Email')
  }
}

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { helperSetUserData } = useContext(AuthContext);

  const { mutate: login, isLoading } = useLogin()

  const { open } = useNotification()
  const axiosInstance = axios.create()

  const navigate = useNavigate()

  const isFilledData = emailRegex.test(email) && password

  const handleLogin =  () => {
    if (isFilledData) {

      const formData = new FormData();

      formData.append('username', email)
      formData.append('password', password)
      axiosInstance
        .post(`${API_URL}/auth/jwt/login`, formData)
        .then(async (res: any) => {
          await fetch(`${API_URL}/auth/update_user/me`, {headers: {
              Authorization: `Bearer ${res.data.access_token}`
            }})
            .then(res => res.json())
            .then(data => {
              localStorage.setItem('token', res.data.access_token)
              localStorage.setItem('userId', data.id)
              localStorage.setItem('isAdmin', JSON.stringify(data?.is_superuser))
              helperSetUserData && helperSetUserData(data)
              login({
                token:  res.data.access_token,
              })
            })
        })
        .catch((err) => {
          open?.({
            type: 'error',
            message: 'Неверные логин или пароль',
          })
        })
    }
  }

  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <section
      className={cx(['container'])}
    >
      <h1
        className={cx(['title'])}
      >
        Фарматол
      </h1>
      <Form
        name="basic"
        style={{
          maxWidth: 600,
          width: 400,
          alignSelf: 'center',
          padding: '20px',
        }}
        initialValues={{ remember: false }}
        onFinish={() => {}}
        onFinishFailed={onFinishFailed}
        autoComplete="on"
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '60px 1fr',
            alignItems: 'center'
          }}
        >
          <p
            className={cx(['text'])}
          >
            E-mail:
          </p>
          <Form.Item
            name="Email"
            rules={[
              {
                required: true,
                message: '',
                validator: validateEmail,
              },
            ]}
          >
            <Input
              placeholder={'Email'}
              type={'email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '300px',
                marginLeft: '9px',
                borderRadius: '2px'
              }}
            />
          </Form.Item>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}
        >
          <p
            className={cx(['text'])}
          >
            Пароль:
          </p>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '' }]}
          >
            <Input.Password
              placeholder={'Password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '300px',
                borderRadius: '2px'
              }}
            />
          </Form.Item>
        </div>

        <Form.Item
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Button
            loading={isLoading}
            disabled={isLoading}
            style={{
              width: '112px',
              background: 'hsla(209, 84%, 40%, 1)',
              borderRadius: '4px',
              height: '40px'
            }}
            type="primary"

            onClick={() => handleLogin()}
          >
            Войти
          </Button>
        </Form.Item>
      </Form>
      {/*<div*/}
      {/*  style={{*/}
      {/*    marginTop: '0px',*/}
      {/*    display: 'flex',*/}
      {/*    flexDirection: 'row',*/}
      {/*    gap: '10px',*/}
      {/*    alignItems: 'center'*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Checkbox*/}
      {/*    style={{*/}
      {/*      top: 0,*/}
      {/*      width: '15px',*/}
      {/*      height: '15px',*/}

      {/*    }}*/}
      {/*  />*/}
      {/*  <p>Запомнить меня на этом компьютере</p>*/}
      {/*</div>*/}
      <div
        style={{
          marginTop: '30px',
        }}
      >
        <Link
          onClick={() => navigate('../reset')}
          style={{
            color: 'hsla(209, 84%, 40%, 1)'
          }}
        >
          Восстановить пароль
        </Link>
      </div>
    </section>

  )
}
