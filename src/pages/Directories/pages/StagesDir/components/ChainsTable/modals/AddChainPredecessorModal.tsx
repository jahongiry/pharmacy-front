import {Modal} from "antd";
import {useCustom, useCustomMutation} from "@refinedev/core";
import {API_URL} from "../../../../../../../constants/url";
import {useState} from "react";
import {SelectComponent} from "../../../../../../../components/ui/SelectComponents/SelectComponent";
import {ModalTitle} from "../../../../../../../components/ui/modalTitle/ModalTitle";
import s from "../../../modals/CreateAndEditStageModal/index.module.css";
import {LowButtons} from "../../../../../../Users/modals/LowButtons";
import save from "../../../../../../../assets/icons/Save.svg";
import close from "../../../../../../../assets/icons/Close.svg";
import {SuccessModal} from "../../../../../../../components/ui/successModal/SuccessModal";


interface IProps {
  isOn: boolean
  off: () => void
  chain_id: number
  refetch: any
  dataStages: any
}

export const AddChainPredecessorModal = ({isOn, off, chain_id, refetch, dataStages} : IProps) => {
  const [stageId, setStageId] = useState(0)
  const [predecessor, setPredecessor ] = useState(0)

  const [isSuccessModal, setIsSuccessModal] = useState(false)


  const { mutate, isLoading } = useCustomMutation<any>()
  const { data: dataChains } = useCustom<any[]>({
    url: `${API_URL}/chain/${chain_id}/${stageId}/get_valid_predecessors`,
    method: 'get',
  })


  const handleCloseModal = () => {
    off()
    setStageId(0)
    setPredecessor(0)
  }

  const handlePredecessor = () => {
    mutate({
      url: `${API_URL}/chain/${chain_id}/${stageId}/add_predecessor?predecessor=${predecessor}`,
      method: 'post',
      values: {},
      successNotification: (): any => {
        setIsSuccessModal(true)

        setTimeout(() => {
          setIsSuccessModal(false)
          handleCloseModal()
        }, 3000)


        refetch()
      },
      errorNotification: (err: any) => {
        handleCloseModal()

        return {
          message: 'Не удалось добавить',
          type: 'error',
        }
      },
    })
  }


  const dropdownChains = dataChains?.data
    ? dataChains?.data.map(el => {
      return {
        key: el.id,
        label: el.name
      }
    })
    : []

  const dropdownStages = dataStages?.data
    ? dataStages?.data.map((el: any) => {
      return {
        key: el.id,
        label: el.name
      }
    })
    : []

  return (
    <>
      <Modal
        open={isOn}
        onCancel={handleCloseModal}
        footer={[]}
        style={{
          minWidth: '545px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '15px',
            paddingBottom: '30px'
          }}
        >
          <ModalTitle title={'Добавить следующий этап'}/>
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
              Новый этап:
            </p>
            <SelectComponent
              selectArray={dropdownStages}
              selectedValue={!stageId ? undefined : stageId}
              onChange={(ids) => {
                setStageId(ids)
              }}
              placeholder={'Выберите этап'}
              style={{width: '360px'}}
            />
            <p
              className={s.description}
            >
              Этап-предшественник:
            </p>
            <SelectComponent
              selectArray={dropdownChains}
              selectedValue={!predecessor ? undefined : predecessor}
              onChange={(ids) => {
                setPredecessor(ids)
              }}
              placeholder={'Выберите этап-предшественник'}
            />
          </div>
        </div>

        <LowButtons
          textOk={'Сохранить'}
          textCancel={'Отменить'}
          iconOk={save}
          iconCancel={close}
          handleClickClose={handleCloseModal}
          handleClickOk={handlePredecessor}
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
