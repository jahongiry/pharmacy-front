import {Modal} from "antd";
import {useCustom, useCustomMutation} from "@refinedev/core";
import {API_URL} from "../../../constants/url";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import TextArea from "antd/lib/input/TextArea";
import {CalendarComponent} from "../../Projects/modals/components/CalendarComponent";
import dayjs from "dayjs";
import moment from "moment/moment";
import {SelectComponent} from "../../../components/ui/SelectComponents/SelectComponent";
import {ModalTitle} from "../../../components/ui/modalTitle/ModalTitle";
import s from "../../Directories/pages/StagesDir/modals/CreateAndEditStageModal/index.module.css";
import {LowButtons} from "../../Users/modals/LowButtons";
import save from "../../../assets/icons/Save.svg";
import close from "../../../assets/icons/Close.svg";
import {SuccessModal} from "../../../components/ui/successModal/SuccessModal";
import {CalendarHelper} from "../../Projects/helpers/CalendarHelper";

interface StateBody {
  performers: any[]
  status_id: number | null
  begin_date: Date | string
  end_date: Date | string | null
  description: string
}

interface IProps {
  isOn: boolean
  off: () => void
  projectStartDate: string
  projectFinishDate: string
  refetch: any
  clickedStage: any
  dataProject: any
}
export const AddStage = (
  {
    isOn,
    off,
    projectStartDate,
    projectFinishDate,
    refetch,
    clickedStage,
    dataProject: employees
  }: IProps
) => {
  const {projectId} = useParams()

  const { mutate, isLoading } = useCustomMutation<any>()

  const [isSendData, setIsSendData] = useState(false)

  const [isSuccessModal, setIsSuccessModal] = useState(false)

  const {toISOStringWithTimezone} = CalendarHelper()

  const [employeeArray, setEmployeeArray] = useState<any>([])
  const [body, setBody] = useState<StateBody>({
    performers: [],
    status_id: null,
    begin_date: projectStartDate,
    end_date: null,
    description: ''
  })

  const { data: dataStatuses } = useCustom<any[]>({
    url: `${API_URL}/status/get_statuses`,
    method: 'get',
  })

  const statusesData = dataStatuses?.data
    ? dataStatuses.data.map(el => {
        return {
          key: el.status.id,
          label: el.status.name
        }
        })
    : []

  const handleCloseModal = () => {
    off()
    setIsSendData(false)
    setBody(
      {
        performers: [],
        status_id: null,
        begin_date: '',
        end_date: null,
        description: ''
      }
    )
  }

  const handleAddStage = () => {
    setIsSendData(true)
    if(body.status_id && body.description ) {
      mutate({
        url: `${API_URL}/project/${projectId}/stage/${clickedStage.stage.id}`,
        method: 'put',
        values: body,
        successNotification: (): any => {
          refetch()
          setIsSuccessModal(true)
          handleCloseModal()

          setTimeout(() => {
            setIsSuccessModal(false)
          }, 3000)
        },
        errorNotification: (err) => {
          handleCloseModal()

          return {
            message: 'Не удалось создать этап',
            type: 'error',
          }
        },
      })
    }
  }

  useEffect(() => {
    if(employees?.data) {
      const array: any[] = []

      employees?.data.working_group.employees.map((el: any) => {
        array.push({
          key: el.id,
          label: el.username,
        })
      })

      setEmployeeArray(array)
    }
  }, [employees])

  useEffect(() => {
    if(clickedStage?.stage) {
      const body: any = {
        begin_date: clickedStage.stage.begin_at,
        end_date: clickedStage.stage.end_at,
        status_id: clickedStage.stage.status_id,
        performers: clickedStage?.performers?.map((el: {id: number}) => el.id),
        description: clickedStage.stage.description
      }
      setBody(body)
    }
  },[clickedStage, isOn])

  return (
    <>
      <Modal
        open={isOn}
        onCancel={handleCloseModal}
        footer={[]}
        style={{
          minWidth: '685px',
          overflow: 'hidden',
          margin: '0 auto'
        }}
      >
        <ModalTitle title={'Этап'}/>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr',
            gap: '15px',
            margin: '16px 0',
            alignItems: 'center',
            maxWidth: '600px'
          }}
        >

          <p
            className={s.description}
          >
            Этап :
          </p>

          <SelectComponent
            selectArray={statusesData}
            placeholder={'Текущий статус этапа'}
            selectedValue={body.status_id ?? ''}
            onChange={(id) => {
              setBody((prevState) => {
                return {
                  ...prevState,
                  status_id: id
                }
              })
            }}
            hasError={isSendData && !body.status_id}
            className={s.input}
          />

          <p
            className={s.description}
          >
            Исполнители :
          </p>

          <SelectComponent
            isMultiple
            selectedValue={body.performers}
            selectArray={employeeArray}
            placeholder={'Исполнители'}
            onChange={(ids) => {
              setBody((prevState) => {
                return {
                  ...prevState,
                  performers: ids
                }
              })
            }}
            className={s.input}
          />

          <p
            className={s.description}
          >
            Сроки :
          </p>

          <CalendarComponent
            value={[body.begin_date ? dayjs(body.begin_date) : '', body.end_date ? dayjs(body.end_date) : undefined]}
            onChange={(day) => {
              setBody((prevState) => {
                return {
                  ...prevState,
                  begin_date: toISOStringWithTimezone(day[0].$d).replace(/Z$/, ''),
                  end_date: toISOStringWithTimezone(day[1].$d).replace(/Z$/, '')
                }
              })
            }}
            hasError={isSendData && !body.begin_date}
            minDate={dayjs(new Date())}
            disabledDate={(current: any) => {
              const startDate = moment(body.begin_date);
              const endDate = moment(projectFinishDate);

              current = current.subtract(-1, 'day');

              // Проверяем, если текущая дата меньше текущего дня
              if (current && current < moment().startOf('day')) {
                return true;
              }

              if (startDate && current && (current < startDate.endOf('day'))) {
                return true;
              }

              if (endDate && current && (current > endDate.endOf('day').add(1, 'day'))) {
                return true;
              }

              return false;
            }}
          />

          <p
            className={s.description}
          >
            Описание :
          </p>

          <TextArea
            value={body.description}
            onChange={(e) => {
              setBody((prevState) => {
                return {
                  ...prevState,
                  description: e.target.value
                }
              })
            }}
            placeholder={'Описание'}
            status={isSendData && !body.description ? 'error' : ''}
            className={s.input}
          />
        </div>

        <LowButtons
          textOk={'Сохранить'}
          iconOk={save}
          textCancel={'Отменить'}
          iconCancel={close}
          handleClickOk={handleAddStage}
          handleClickClose={handleCloseModal}
        />
      </Modal>
      {isSuccessModal &&
        <SuccessModal
          text={'Этап создан'}
        />
      }
    </>
  )
}
