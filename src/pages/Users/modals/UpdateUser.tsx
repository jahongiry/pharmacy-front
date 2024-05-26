import { Input, Modal} from "antd";
import {useCustomMutation} from "@refinedev/core";
import {API_URL} from "../../../constants/url";
import { useEffect, useState} from "react";
import {ModalHelpers} from "../helpers/ModalHelpers";
import s from './styles.module.css'
import userLight from '../../../assets/icons/userLight.svg'
import {LowButtons} from "./LowButtons";
import save from '../../../assets/icons/Save.svg'
import close from '../../../assets/icons/Close.svg'
import lockSmall from '../../../assets/icons/LockSmall.svg'
import {SuccessModal} from "../../../components/ui/successModal/SuccessModal";


interface IProps {
  isOpen: boolean
  off: () => void
  user?: Record<string, any>
  refetch: any
  editByUser?: boolean
  typeEdit?: string
}

export const UpdateUser = ({isOpen, off, user, refetch, editByUser, typeEdit}: IProps) => {
  const { mutate, isLoading } = useCustomMutation<any>()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isProjectManager, setIsProjectManager] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const [isSuccessModal, setIsSuccessModal] = useState(false)

  const [isSendData, setIsSendData] = useState(false)

  const {checkboxLayout} = ModalHelpers()


  const handleUpdateUser = () => {
    setIsSendData(true)
    if(username && (editByUser && password ? password === confirmPassword : true)) {
      const body: Record<string, string | boolean>  = {
        username: username,
        is_superuser: isAdmin,
        is_project_manager: isProjectManager
      }

      if(password) {
        editByUser ? body.hashed_password = password : body.password = password
      }


      mutate({
        url: editByUser ? `${API_URL}/auth/update_user_info` : `${API_URL}/auth/update_user_by_admin/?user_id=${user?.id}`,
        method: 'patch',
        values: body,
        successNotification: (): any => {
          refetch()
          handleCloseModal()

          setIsSuccessModal(true)
          setTimeout(() => {
            setIsSuccessModal(false)

          }, 3000)
        },
        errorNotification: (err) => {
          handleCloseModal()

          return {
            message: 'Не удалось обновить пользователя',
            type: 'error',
          }
        },
      })
    }
  }

  const handleCloseModal = () => {
    off()
    setUsername('')
    setPassword('')
    setConfirmPassword('')
    setIsAdmin(false)
    setIsSendData(false)
  }

  useEffect(() => {
    if(user) {
      setIsAdmin(user.is_superuser)
      setUsername(user.username)
    }
  }, [user, isOpen])

  const NameInput = () => {
    return (
      <>
        <p
          className={s.description}
        >
          Сотрудник:
        </p>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={'Имя и фамилия'}
          className={s.input}
          prefix={<img src={userLight} alt={'user'} />}
        />
      </>
    )
  }

  const passwordInput = () => {
    return (
      <>
        <p
          className={s.description}
        >
          Новый пароль:
        </p>
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={'Новый пароль'}
          type={'password'}
          className={s.input}
          prefix={<img src={lockSmall} alt={'lockSmall'}/>}
        />
      </>
    )
  }

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={handleCloseModal}
        footer={[]}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '130px 1fr',
            gap: '15px',
            paddingTop: '30px',
            margin: '0 auto',
            alignItems: 'center'
          }}
        >
          {editByUser
            ? typeEdit === 'name' && NameInput()
            : NameInput()
          }

          {editByUser
            ? typeEdit === 'password' && passwordInput()
            :  passwordInput()
          }

          {editByUser && typeEdit === 'password' &&
            <>
              <p
                className={s.description}
              >
                Подтвердить пароль:
              </p>
              <Input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={'Подтвердить пароль'}
                status={isSendData && (confirmPassword !== password) ? 'error' : ''}
                type={'password'}
                className={s.input}
                prefix={<img src={lockSmall} alt={'lockSmall'}/>}
              />
            </>

          }
          {!editByUser &&
            <>
              <p
                className={s.description}
              >
                Роли :
              </p>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                {checkboxLayout('Руководитель проектов', isProjectManager, setIsProjectManager)}
                {checkboxLayout('Администратор', isAdmin, setIsAdmin)}
              </div>
            </>
          }
        </div>

        <LowButtons
          textOk={'Сохранить'}
          textCancel={'Отменить'}
          iconOk={save}
          iconCancel={close}
          handleClickClose={handleCloseModal}
          handleClickOk={handleUpdateUser}
        />
      </Modal>
      {isSuccessModal &&
        <SuccessModal
          text={'Изменения сохранены'}
        />
      }
    </>

  )
}
