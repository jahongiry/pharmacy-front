import classNames from "classnames/bind";
import styles from "../Login/login.module.css";
import {Button, Form, Input, Typography} from "antd";
import {validateEmail} from "../Login/Login";
import {useState} from "react";
import {useCustomMutation} from "@refinedev/core";
import {API_URL} from "../../constants/url";
import {emailRegex} from "../../constants/regexp";
import { useNavigate} from "react-router-dom";
import {SuccessModal} from "../../components/ui/successModal/SuccessModal";
import s from "../Directories/pages/StagesDir/modals/CreateAndEditStageModal/index.module.css";

const cx = classNames.bind(styles)

const {Link} = Typography

export const ResetPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isSuccessModal, setIsSuccessModal] = useState(false)

  const { mutate, isLoading } = useCustomMutation<any>()

  const handleResetPassword = () => {
    if(emailRegex.test(email)) {
      mutate({
        url: `${API_URL}/auth/forgot-password`,
        method: 'post',
        values: {
          email: email
        },
        successNotification: (): any => {
          setTimeout(() => {
            window.location.replace('/login')
          }, 3000)
          setIsSuccessModal(true)
        },
        errorNotification: (err) => {
          return {
            message: 'Не удалось сбросить пароль',
            type: 'error',
          }
        },
      })
    }
  }


  return (
    <div
      style={{
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      <section
        className={cx(['container'])}
      >
        <h1
          className={cx(['titleLight'])}
        >
          Восстановление пароля
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
          onFinishFailed={() => {}}
          autoComplete="on"
        >

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
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '300px',
                  marginLeft: '5px'
                }}
                className={s.input}
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
                width: '172px',
                background: 'hsla(209, 84%, 40%, 1)',
                height: '40px',
                borderRadius: '4px'
              }}
              type="primary"
              onClick={handleResetPassword}
            >
              Восстановить
            </Button>
          </Form.Item>
        </Form>
        <Link
          onClick={() => navigate('/login')}
          style={{
            color: 'hsla(209, 84%, 40%, 1)'
          }}
        >
          На страницу входа
        </Link>

      </section>

      {isSuccessModal &&
        <SuccessModal
          text={'На ваш электронный адрес выслано письмо с интрукцией по восстановлению пароля'}
        />
      }

    </div>

  )
}
