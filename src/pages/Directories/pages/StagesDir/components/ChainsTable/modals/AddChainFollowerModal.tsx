import {Modal} from "antd";
import {useCustom, useCustomMutation} from "@refinedev/core";
import {API_URL} from "../../../../../../../constants/url";
import {useEffect, useState} from "react";
import {SelectComponent} from "../../../../../../../components/ui/SelectComponents/SelectComponent";
import {ModalTitle} from "../../../../../../../components/ui/modalTitle/ModalTitle";
import s from "../../../modals/CreateAndEditStageModal/index.module.css";
import save from "../../../../../../../assets/icons/Save.svg";
import close from "../../../../../../../assets/icons/Close.svg";
import {LowButtons} from "../../../../../../Users/modals/LowButtons";
import {SuccessModal} from "../../../../../../../components/ui/successModal/SuccessModal";


interface IProps {
  isOn: boolean
  off: () => void
  refetch: any
  chain_id: number
  dataStages: any
}
export const AddChainFollowerModal = ({isOn, off, refetch, chain_id, dataStages}: IProps) => {
  const { mutate, isLoading } = useCustomMutation<any>()

  const [stageId, setStageId] = useState(0)
  const [followerId, setFollowerId ] = useState(0)
  const [dropdownChain, setDropdownChain] = useState<any[]>([])

  const [isSuccessModal, setIsSuccessModal] = useState(false)

  const { data: dataChains } = useCustom<any[]>({
    url: `${API_URL}/chain/${chain_id}`,
    method: 'get',
  })

  const handleCloseModal = () => {
    off()
    setFollowerId(0)
    setStageId(0)
  }

  const handleAdd = () => {
    mutate({
      url: `${API_URL}/chain/${chain_id}/${stageId}/add_follower?follower=${followerId}`,
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


  const dropdownStages = dataStages?.data
    ? dataStages?.data.map((el: any) => {
      return {
        key: el.id,
        label: el.name
      }
    })
    : []

  useEffect(() => {
    if(dataChains) {
      const arr: any[] = []
      dataChains?.data?.map((el: any) => el.map((item:any) => arr.push(item)))
      const mapArr = arr.map((el) => {
        return {
          key: el.stage.id,
          label: el.stage.name

        }
      })
      setDropdownChain(mapArr)
    }
  }, [dataChains])


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
          <ModalTitle title={'Добавить предыдущий этап'}/>

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
              selectArray={dropdownChain}
              selectedValue={!stageId ? undefined : stageId}
              onChange={(ids) => {
                setStageId(ids)
              }}
              placeholder={'Выберите этап'}
            />

            <p
              className={s.description}
            >
              Этап-последователь:
            </p>

            <SelectComponent
              selectArray={dropdownStages}
              selectedValue={!followerId ? undefined : followerId}
              onChange={(ids) => {
                setFollowerId(ids)
              }}
              placeholder={'Выберите этап-последователь'}
              style={{width: '360px'}}
            />
          </div>
        </div>
        <LowButtons
          textOk={'Сохранить'}
          textCancel={'Отменить'}
          iconOk={save}
          iconCancel={close}
          handleClickClose={handleCloseModal}
          handleClickOk={handleAdd}
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
