import { Input, Modal} from "antd";
import {useCustomMutation} from "@refinedev/core";
import {useEffect, useState} from "react";
import {API_URL} from "../../../../../../constants/url";
import {ModalTitle} from "../../../../../../components/ui/modalTitle/ModalTitle";
import s from "../CreateAndEditStageModal/index.module.css";
import save from "../../../../../../assets/icons/Save.svg";
import close from "../../../../../../assets/icons/Close.svg";
import {LowButtons} from "../../../../../Users/modals/LowButtons";
import {SuccessModal} from "../../../../../../components/ui/successModal/SuccessModal";

interface IProps {
  isOn: boolean
  off: () => void
  clickedStage?: any
  refetch: any
  clickedChain?: any
}

export const CreateChainModal = ({isOn, off, clickedStage, refetch, clickedChain}: IProps) => {
  const [isSuccessModal, setIsSuccessModal] = useState(false)

  const { mutate, isLoading } = useCustomMutation<any>()

  const [name, setName] = useState('')
  const handleCloseModal = () => {
    off()
    setName('')
  }

  const handleChain = () => {
    if(name) {
      const body: any = {
        name: name
      }

      if(clickedStage) {
        body.root_stage_id = clickedStage.id
      }

      mutate({
        url: clickedChain ? `${API_URL}/chain/${clickedChain.id}` : `${API_URL}/chain/create`,
        method: clickedChain ? 'patch' : 'post',
        values: body,
        successNotification: (): any => {
          handleCloseModal()
          refetch()

          setIsSuccessModal(true)

          setTimeout(() => {
            setIsSuccessModal(false)
          }, 3000)
        },
        errorNotification: (err: any) => {
          handleCloseModal()


          return {
            message: err.response.data.detail,
            type: 'error',
          }
        },
      })
    }
  }

  useEffect(() => {
    if(clickedChain) {
      setName(clickedChain.name)
    }
  }, [clickedChain, isOn])

  return (
    <>
      <Modal
        open={isOn}
        onCancel={handleCloseModal}
        footer={[]}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '15px',
          }}
        >
          <ModalTitle title={`${clickedChain ? 'Изменить' : 'Создать'} цепочку`}/>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr',
              gap: '15px',
              margin: '0 auto',
              alignItems: 'center'
            }}
          >
            <p
              className={s.description}
            >
              Название:
            </p>

            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={s.input}
              style={{
                width: '361px'
              }}
            />
          </div>
        </div>

        <LowButtons
          textOk={'Сохранить'}
          textCancel={'Отменить'}
          iconOk={save}
          iconCancel={close}
          handleClickClose={handleCloseModal}
          handleClickOk={handleChain}
        />

      </Modal>

      {isSuccessModal &&
        <SuccessModal
          text={clickedChain ? 'Цепочка изменена' : 'Цепочка создана'}
        />
      }
    </>

  )
}
