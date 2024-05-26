import { Input, Modal} from "antd";
import {useCustom, useCustomMutation} from "@refinedev/core";
import {useEffect, useState} from "react";
import TextArea from "antd/lib/input/TextArea";
import {API_URL} from "../../../../../../constants/url";
import {SelectComponent} from "../../../../../../components/ui/SelectComponents/SelectComponent";
import s from './index.module.css'
import {ModalTitle} from "../../../../../../components/ui/modalTitle/ModalTitle";
import {LowButtons} from "../../../../../Users/modals/LowButtons";
import save from "../../../../../../assets/icons/Save.svg";
import close from "../../../../../../assets/icons/Close.svg";
import {SuccessModal} from "../../../../../../components/ui/successModal/SuccessModal";

interface IProps {
  isOpen: boolean
  off: () => void
  clickedStage?: Record<string, any>
  refetch: any
}
export const CreateAndEditStageModal = ({isOpen, off, clickedStage, refetch}: IProps) => {
  const { mutate, isLoading } = useCustomMutation<any>()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [statuses, setStatuses] = useState<number[]>([])

  const [isSendData, setIsSendData] = useState(false)
  const [isSuccessModal, setIsSuccessModal] = useState(false)

  const { data: dataStatuses } = useCustom<any[]>({
    url: `${API_URL}/status/get_statuses`,
    method: 'get',
  })

  const statusesDropdown = dataStatuses?.data
    ? dataStatuses.data.map((el: any) => {
      return {
      key: String(el.status.id),
      label: el.status.name
    }})
    : []

  const handleCloseModal = () => {
    off()
    setTitle('')
    setDescription('')
    setStatuses([])
    setIsSendData(false)
  }

  const handleStage = () => {
    setIsSendData(true)
    const body = {
      name: title,
      description: description,
      possible_statuses: statuses
    }

    if(title) {
      mutate({
        url: clickedStage ? `${API_URL}/stage/${clickedStage.id}` : `${API_URL}/stage/create_stage`,
        method: clickedStage ? 'put' : 'post',
        values: body,
        successNotification: (): any => {
          handleCloseModal()
          refetch()
          setIsSuccessModal(true)

          setTimeout(() => {
            setIsSuccessModal(false)
          }, 3000)
        },
        errorNotification: (err) => {
          handleCloseModal()

          return {
            message: clickedStage ? 'Не удалось изменить статус' : 'Не удалось создать статус',
            type: 'error',
          }
        },
      })
    }
  }

  useEffect(() => {
    if(clickedStage) {
      setTitle(clickedStage.name)
      setDescription(clickedStage.description)
      setStatuses(clickedStage.possible_statuses.map((el: {id: number}) => el.id))
    }
  }, [isOpen, clickedStage])

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={handleCloseModal}
        footer={[]}
        style={{
          minWidth: '690px',
          overflow: 'hidden'
        }}
      >

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '15px',
          }}
        >
          <ModalTitle title={clickedStage ? 'Изменить этап' : 'Создать этап'}/>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr',
              gap: '15px',
              paddingTop: '30px',
              margin: '0 auto',
              alignItems: 'center'
            }}
          >
            <p
              className={s.description}
            >
              Этап:
            </p>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
              }}
              placeholder={'Название'}
              status={isSendData && !title ? 'error' : ''}
              className={s.input}
            />

            <p
              className={s.description}
            >
              Описание:
            </p>
            <TextArea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
              }}
              placeholder={'Описание'}
              className={s.textArea}
            />

            <p
              className={s.description}
            >
              Возможные статусы:
            </p>
            <SelectComponent
              selectArray={statusesDropdown}
              selectedValue={statuses}
              onChange={(ids) => {
                setStatuses(ids)
              }}
              placeholder={'Возможные статусы этапов'}
              isMultiple
            />

          </div>
        </div>

        <LowButtons
          textOk={'Сохранить'}
          textCancel={'Отменить'}
          iconOk={save}
          iconCancel={close}
          handleClickClose={handleCloseModal}
          handleClickOk={handleStage}
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
