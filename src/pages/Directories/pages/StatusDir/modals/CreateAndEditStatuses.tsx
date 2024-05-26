import {Input, Modal} from "antd";
import {useCustomMutation} from "@refinedev/core";
import {useEffect, useState} from "react";
import {SelectComponent} from "../../../../../components/ui/SelectComponents/SelectComponent";
import {API_URL} from "../../../../../constants/url";
import {ModalTitle} from "../../../../../components/ui/modalTitle/ModalTitle";
import s from "../../StagesDir/modals/CreateAndEditStageModal/index.module.css";
import save from "../../../../../assets/icons/Save.svg";
import close from "../../../../../assets/icons/Close.svg";
import {LowButtons} from "../../../../Users/modals/LowButtons";
import {SuccessModal} from "../../../../../components/ui/successModal/SuccessModal";

interface IProps {
  isOn: boolean
  off: () => void
  clickedStatus?: Record<string, any>
  refetch: any
  dataStatuses: any
}

export const CreateAndEditStatuses = (
  {
    isOn,
    off,
    clickedStatus,
    refetch,
    dataStatuses
  }: IProps) => {
  const { mutate, isLoading } = useCustomMutation<any>()

  const [title, setTitle] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const [isSuccessModal, setIsSuccessModal] = useState(false)

  const statusesDropDown = dataStatuses?.data
    ? dataStatuses.data.map((el: {status: {id: number, name: string}}) => {
      return {
        key: el.status.id,
        label: el.status.name
      }
      })
    : []


  const handleCloseModal = () => {
    off()
    setTitle('')
    setSelectedIds([])
  }

  const handleStatus = () => {
    if(title) {
      const body = {
        name: title,
        transitions: selectedIds
      }

      mutate({
        url: clickedStatus ? `${API_URL}/status/${clickedStatus.status.id}` : `${API_URL}/status/create_status`,
        method: clickedStatus ? 'put' : 'post',
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
            message: clickedStatus ? 'Не удалось изменить статус' : 'Не удалось создать статус',
            type: 'error',
          }
        },
      })
    }

  }

  useEffect(() => {
    if(clickedStatus) {
      setTitle(clickedStatus.status.name)
      clickedStatus?.transitions?.map((el: any) => el.map((item: any) => setSelectedIds((prevState) => [...prevState, String(item.id)])) )
    }
  }, [clickedStatus, isOn])

  return (
    <Modal
      open={isOn}
      onCancel={handleCloseModal}
      footer={[]}
      style={{
        width: '545px'
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
        <ModalTitle title={clickedStatus ? 'Изменить статус' : 'Создать статус'}/>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '90px 1fr',
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
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
            }}
            placeholder={'Название'}
            className={s.input}
            style={{maxWidth: '360px'}}
          />

          <p
            className={s.description}
          >
            Последователь:
          </p>


          <SelectComponent
            isMultiple
            isString
            selectArray={statusesDropDown}
            placeholder={'Статусы-последователи'}
            selectedValue={selectedIds}
            onChange={(ids) => setSelectedIds(ids)}
            style={{maxWidth: '360px'}}
          />
        </div>
      </div>

      <LowButtons
        textOk={'Сохранить'}
        textCancel={'Отменить'}
        iconOk={save}
        iconCancel={close}
        handleClickClose={handleCloseModal}
        handleClickOk={handleStatus}
      />

      {isSuccessModal &&
        <SuccessModal
          text={'Изменения сохранены'}
        />
      }
    </Modal>
  )
}
