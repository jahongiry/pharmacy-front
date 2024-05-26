import {Button, Form, Input, Typography} from "antd";
import {useEffect, useState} from "react";
import classNames from "classnames/bind";
import styles from "../Login/login.module.css";
import {useCustom, useLogin, useNotification} from "@refinedev/core";
import {API_URL} from "../../constants/url";
import {validateEmail} from "../Login/Login";
import {useNavigate, useParams} from "react-router-dom";
import s from "../Directories/pages/StagesDir/modals/CreateAndEditStageModal/index.module.css";

const cx = classNames.bind(styles)

const {Link, Text} = Typography

export const CreateUser = () => {
  const {code: codeParam} = useParams()

  const navigate = useNavigate()

  const { data} = useCustom<any>({
    url: `${API_URL}/auth/email_by_code/${codeParam}`,
    method: 'get',
  })

  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { isLoading } = useLogin()

  const { open } = useNotification()

  const isFillData = userName && codeParam && password && confirmPassword && (password === confirmPassword)

  const handleCreateUser = async (values: Record<string, any>) => {
    if (isFillData) {
        fetch(`${API_URL}/auth/create_password_and_username_by_user`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        })
          .then((res) => res.json())
          .then(res => {
            if(res) {
              window.location.replace(`/login`)
            }
          })
          .catch((err) => {
            console.log(err, 'err')
            if(err) {
              open?.({
                type: 'error',
                message: err.response?.data?.detail ? err.response?.data?.detail : 'Не удалось зарегистрироваться'
              })
            }
          })
    }
  }

  useEffect(() => {
    if(data?.data) {
      setEmail(data?.data)
    }
  }, [data])

  return (
    <section
      className={cx(['container'])}
    >
      <h1
        className={cx(['titleLight'])}
      >
        Регистрация пользователя
      </h1>


      <Form
        name="basic"
        style={{
          maxWidth: 500,
          alignSelf: 'center',
          padding: '20px',
          display: 'grid',
          gridTemplateColumns: '150px 1fr',
          gap: '15px',
          alignItems: 'center'
        }}
        initialValues={{ remember: true }}
        onFinish={() => {}}
        onFinishFailed={() => {}}
        autoComplete="on"
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
              message: 'Введите Email',
              validator: validateEmail,
            },
          ]}
        >
          <Input
            placeholder={'Email'}
            type={'email'}
            value={email}
            readOnly={true}
            style={{
              width: '300px',
              marginLeft: '5px'
            }}
            className={s.input}
          />
        </Form.Item>

        <p
          className={cx(['text'])}
        >
          Имя и фамилия:
        </p>
        <Form.Item
          name="UserName"
          rules={[
            {
              required: true,
              message: 'Введите имя и фамилию',
            },
          ]}
        >
          <Input
            placeholder={'Введите имя и фамилию'}
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value)
            }}
            style={{
              width: '300px',
              marginLeft: '5px'
            }}
            className={s.input}
          />
        </Form.Item>

        <p
          className={cx(['text'])}
        >
          Пароль:
        </p>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Введите пароль' }]}
        >
          <Input.Password
            placeholder={'Пароль'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            style={{
              width: '300px',
              marginLeft: '5px'
            }}
            className={s.input}
          />
        </Form.Item>

        <p
          className={cx(['text'])}
        >
          Подтвердите пароль:
        </p>
        <Form.Item
          name="confirmPassword"
          rules={[{ required: true, message: 'Введите пароль' }]}
        >
          <Input.Password
            placeholder={'Подтвердите пароль'}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
            }}
            style={{
              width: '300px',
              marginLeft: '5px'
            }}
            className={s.input}
          />
        </Form.Item>
      </Form>

      <Button
        loading={isLoading}
        disabled={!isFillData || isLoading}
        style={{
          width: '172px',
          background: 'hsla(209, 84%, 40%, 1)',
          borderRadius: '4px',
          height: '40px',
          color: 'white',
        }}
        type="primary"
        htmlType="submit"
        onClick={() => handleCreateUser(
          {
            email: email,
            create_password: password,
            create_username: userName,
            validate_number: codeParam
          }
        )}
      >
        Регистрация
      </Button>
      <Link
        onClick={() => navigate('/login')}
        style={{
          color: 'hsla(209, 84%, 40%, 1)',
          marginTop: '20px'
        }}
      >
        На страницу входа
      </Link>
    </section>
  )
}
