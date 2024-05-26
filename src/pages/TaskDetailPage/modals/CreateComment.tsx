import {Button, Modal, Typography} from "antd";
import {useCustomMutation} from "@refinedev/core";
import {useContext, useRef, useState} from "react";
import {API_URL} from "../../../constants/url";
import {AuthContext} from "../../../context/AuthProvider";
import {useParams} from "react-router-dom";
import JoditEditor from 'jodit-react'
import {config} from "../../Projects/config";
import send from '../../../assets/icons/send.svg'
import {ModalTitle} from "../../../components/ui/modalTitle/ModalTitle";
import {LowButtons} from "../../Users/modals/LowButtons";
import save from "../../../assets/icons/Save.svg";
import close from "../../../assets/icons/Close.svg";
import {SuccessModal} from "../../../components/ui/successModal/SuccessModal";

const {Title} = Typography

interface IProps {
  isOn: boolean
  off: () => void
  refetch: any
  replyId?: number
}
export const CreateComment = ({isOn, off, refetch, replyId}: IProps) => {
  const {taskId} = useParams()
  const editor = useRef(null)

  const { mutate, isLoading } = useCustomMutation<any>()
  const [text, setText] = useState('')

  const [isSuccessModal, setIsSuccessModal] = useState(false)

  const { userData } = useContext(AuthContext);

  const handleCancel = () => {
    off()
    setText('')
  }

  const handleCreateComment = () => {
    if(text) {
      const body = {
        text: text,
        reply_to: replyId ? replyId : null,
        author_id: userData?.id
      }

      mutate({
        url: `${API_URL}/task/${taskId}/add_comment`,
        method: 'post',
        values: body,
        successNotification: (): any => {
          refetch()
          setIsSuccessModal(true)
          handleCancel()

          setTimeout(() => {
            setIsSuccessModal(false)
          }, 3000)
        },
        errorNotification: (err) => {
          handleCancel()

          return {
            message: 'Не удалось отправить',
            type: 'error',
          }
        },
      })
    }
  }



  return (
    <>
      <Modal
        open={isOn}
        onCancel={handleCancel}
        footer={[]}
      >
        <ModalTitle title={'Комментарий'}/>
        <div
          style={{
            marginTop: '16px'
          }}
        >
          <JoditEditor
            ref={editor}
            config={config}
            value={text}
            onChange={(value) => {
              setText(value)
            }}
          />
        </div>


        <LowButtons
          textOk={'Отправить'}
          iconOk={save}
          textCancel={'Отменить'}
          iconCancel={close}
          handleClickOk={handleCreateComment}
          handleClickClose={handleCancel}
        />
      </Modal>
      {isSuccessModal &&
        <SuccessModal
          text={'Комментарий отправлен'}
        />
      }
    </>

  )
}
