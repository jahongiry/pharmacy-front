import {useState} from "react";
import {Button, Input, Modal} from "antd";
import {useCustomMutation} from "@refinedev/core";
import {ModalHelpers} from "../helpers/ModalHelpers";
import {API_URL} from "../../../constants/url";
import s from "../../Directories/pages/StagesDir/modals/CreateAndEditStageModal/index.module.css";
import mail from '../../../assets/icons/mail.svg'
import save from "../../../assets/icons/Save.svg";
import close from "../../../assets/icons/Close.svg";
import {LowButtons} from "./LowButtons";
import {SuccessModal} from "../../../components/ui/successModal/SuccessModal";


interface IProps {
  isOpen: boolean
  off: () => void
  user?: any
  refetch: any
}
export const CreateNewUser = ({isOpen, off, user, refetch}: IProps) => {
  const [email, setEmail] = useState('')
  const [isSuperUser, setIsSuperUser] = useState(false)
  const [isProjectManager, setIsProjectManager] = useState(false)

  const [isSuccessModal, setIsSuccessModal] = useState(false)

  const { mutate, isLoading } = useCustomMutation<any>()

  const {checkboxLayout} = ModalHelpers()

  const handleCreateUser = () => {
    const body = {
      email: email,
      is_project_manager: isProjectManager,
      is_superuser: isSuperUser
    }

    mutate({
      url: `${API_URL}/auth/create_user_email_and_role?email=${email}&is_project_manager=${isProjectManager}&is_superuser=${isSuperUser}`,
      method: 'post',
      values: {},
      successNotification: (): any => {
        setIsSuccessModal(true)
        handleCloseModal()

        setTimeout(() => {
          setIsSuccessModal(false)
        }, 3000)

        refetch()
      },
      errorNotification: (err) => {
        handleCloseModal()

        return {
          message: 'Не удалось создать пользователя',
          type: 'error',
        }
      },
    })
  }

  const handleCloseModal = () => {
    off()
    setEmail('')
    setIsSuperUser(false)
    setIsProjectManager(false)
  }

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={handleCloseModal}
        footer={[]}
        style={{
          minWidth: '510px',
          overflow: 'hidden',
          margin: '0 auto'
        }}
      >

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr',
            gap: '15px',
            margin: '16px 0',
            alignItems: 'baseline',
            maxWidth: '400px',
          }}
        >
          <p
            className={s.description}
          >
            Email :
          </p>
          <Input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            placeholder={'Email'}
            className={s.input}
            prefix={<img src={mail} alt={'mail'} />}
            style={{
              width: '320px'
            }}
          />

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
            {checkboxLayout('Администратор', isSuperUser, setIsSuperUser)}
            {checkboxLayout('Руководитель проектов', isProjectManager, setIsProjectManager)}
          </div>
        </div>

        <LowButtons
          textOk={'Сохранить'}
          iconOk={save}
          textCancel={'Отменить'}
          iconCancel={close}
          handleClickOk={handleCreateUser}
          handleClickClose={handleCloseModal}
        />
      </Modal>

      {isSuccessModal &&
        <SuccessModal
          text={'Приглашение отправлено пользователю'}
        />
      }
    </>
  )
}
