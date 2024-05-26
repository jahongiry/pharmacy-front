import s from './index.module.css'
import {Button, Modal, Space, Typography} from "antd";
import save from "../../../assets/icons/Save.svg";
import close from "../../../assets/icons/Close.svg";
import {LowButtons} from "../../../pages/Users/modals/LowButtons";
import trash from '../../../assets/icons/trash.svg'

const {Text, Title} = Typography

interface IProps {
  isOn: boolean
  off: () => void
  handleOk: () => void
  isLoading?: boolean
  title: string
  description?: string
}

export const ConfirmDeleteModal = ({ isOn, off, handleOk, title, description}: IProps) => {

  return (
    <Modal
      open={isOn}
      onCancel={off}
      footer={[]}
      style={{maxWidth: '400px'}}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <p className={s.title}>{title}</p>
        <p
          className={s.description}
        >
          {description ? description : 'Отменить это действие будет нельзя'}
        </p>
      </div>
      <LowButtons
        textOk={'Удалить'}
        textCancel={'Отменить'}
        iconOk={trash}
        iconCancel={close}
        handleClickClose={off}
        handleClickOk={handleOk}
        okColor={'hsla(25, 100%, 50%, 1)'}
      />
    </Modal>
  )
}
