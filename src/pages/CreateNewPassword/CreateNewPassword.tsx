import classNames from "classnames/bind";
import styles from "../Login/login.module.css";
import {Button, Form, Input, Typography} from "antd";
import {useState} from "react";
import {useCustom, useCustomMutation} from "@refinedev/core";
import {API_URL} from "../../constants/url";
import {useLocation} from "react-router-dom";
import s from "../Directories/pages/StagesDir/modals/CreateAndEditStageModal/index.module.css";
import {SuccessModal} from "../../components/ui/successModal/SuccessModal";

const cx = classNames.bind(styles)

export const CreateNewPassword = () => {
  const location = useLocation();
  const id = new URLSearchParams(location.search).get('id');
  const token = new URLSearchParams(location.search).get('token');

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { mutate, isLoading } = useCustomMutation<any>()

  const [isSuccessModal, setIsSuccessModal] = useState(false)

  // const { data } = useCustom<any>({
  //   url: `${API_URL}/auth/get_username/${id}`,
  //   method: 'get',
  // })
  //
  // console.log(data, 'data')

  const handleCreateNewPassword = () => {
    if(password === confirmPassword) {
      mutate({
        url: `${API_URL}/auth/reset-password`,
        method: 'post',
        values: {
          password: password,
          token: token
        },
        successNotification: (): any => {
          setTimeout(() => {
            window.location.replace('/login')
          }, 3000)

          setIsSuccessModal(true)

          setTimeout(() => {
            setIsSuccessModal(false)
          }, 3000)
        },
        errorNotification: (err) => {
          return {
            message: 'Не удалось обновить пароль',
            type: 'error',
          }
        },
      })
    }
  }

  return (
    <section
      className={cx(['container'])}
    >
      <h1
        className={cx(['titleLight'])}
      >
        Введите новый пароль
      </h1>

      <Form
        name="basic"
        style={{
          alignSelf: 'center',
          padding: '20px',
        }}
        initialValues={{ remember: false }}
        onFinish={() => {}}
        onFinishFailed={() => {}}
        autoComplete="on"
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '170px 1fr',
            alignItems: 'center'
          }}
        >
          <p
            className={cx(['text'])}
          >
            Новый пароль:
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
              style={{width: '300px'}}
              className={s.input}
            />
          </Form.Item>

          <p
            className={cx(['text'])}
          >
            Новый пароль еще раз:
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
              style={{width: '300px'}}
              className={s.input}
            />
          </Form.Item>
        </div>
      </Form>
      <Button
        loading={isLoading}
        disabled={isLoading}
        style={{
          width: '120px',
          background: 'hsla(209, 84%, 40%, 1)',
          height: '40px',
          borderRadius: '4px',
        }}
        type="primary"

        onClick={handleCreateNewPassword}
      >
        Готово
      </Button>

      {isSuccessModal &&
        <SuccessModal
          text={'Ваш пароль успешно обновлен'}
        />
      }
    </section>
  )
}
