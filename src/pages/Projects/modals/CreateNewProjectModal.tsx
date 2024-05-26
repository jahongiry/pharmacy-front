import { Checkbox, Input, Modal} from "antd";
import {useCustomMutation} from "@refinedev/core";
import {API_URL} from "../../../constants/url";
import {useEffect, useRef, useState} from "react";
import {CalendarComponent} from "./components/CalendarComponent";
import moment from "moment";
import 'moment/dist/locale/ru'
import dayjs from "dayjs";
import {SelectComponent} from "../../../components/ui/SelectComponents/SelectComponent";
import {typeItems} from "../projectsMock";
import {ProjectHelper} from "../helpers/ProjectHelper";
import {AdditionalFields} from "./components/AdditionalFields";
import {useParams} from "react-router-dom";
import JoditEditor from 'jodit-react'
import {config} from "../config";
import './components/joditStyles.css'
import {ModalTitle} from "../../../components/ui/modalTitle/ModalTitle";
import s from "../../Directories/pages/StagesDir/modals/CreateAndEditStageModal/index.module.css";
import {LowButtons} from "../../Users/modals/LowButtons";

import save from '../../../assets/icons/Save.svg';
import close from "../../../assets/icons/Close.svg";
import {SuccessModal} from "../../../components/ui/successModal/SuccessModal";
import {CalendarHelper} from "../helpers/CalendarHelper";

moment.locale('ru')

export interface BodyTypes {
  name: string
  description: string
  created_at: Date | string
  finished_at: Date | string
  checkbox: boolean
  trade_name: string
  international_nonproprietary_name: string
  chemical_name: string
  type: string
  pharmacotherapeutic_group_id: number | null
  pharmaceutical_substances: number[]
  analogues: number[]
  manager: number | null
  employees: number[]
  properties: {additional_column: string; additional_value: string}[]
  stages_chain_id: null | number
}

interface IProps {
  isOn: boolean
  handleCancel: () => void
  refetch: any
  clickedProject?: any
}
export const CreateNewProjectModal = (
  {
    isOn,
    handleCancel,
    refetch,
    clickedProject
  }: IProps
) => {
  const {projectId} = useParams()
  const editor = useRef(null)

  const [isSendData, setIsSendData] = useState(false)

  const [isSuccessModal, setIsSuccessModal] = useState(false)

  const { mutate, isLoading } = useCustomMutation<any>()

  const {
    dataGroupsDropDown,
    dataAnalogsDropDown,
    dataSubstancesDropDown,
    dataUsersDropDown,
    dataManagersDropDown,
    dataChainsDropDown
  } = ProjectHelper()

  const [body, setBody] = useState<BodyTypes>({
    name: '',
    description: '',
    created_at: new Date().toISOString(),
    finished_at: '',
    checkbox: false,
    trade_name: '',
    international_nonproprietary_name: '',
    chemical_name: '',
    type: '',
    pharmacotherapeutic_group_id: null,
    manager: null,
    employees: [],
    pharmaceutical_substances: [],
    analogues: [],
    properties: [],
    stages_chain_id: null
  })

  const {toISOStringWithTimezone} = CalendarHelper()

  const handleCloseModal = () => {
    handleCancel()
    setIsSendData(false)
    setBody(
      {
        name: '',
        description: '',
        created_at: new Date().toISOString(),
        finished_at: '',
        checkbox: false,
        trade_name: '',
        international_nonproprietary_name: '',
        chemical_name: '',
        type: '',
        pharmacotherapeutic_group_id: null,
        manager: null,
        employees: [],
        pharmaceutical_substances: [],
        analogues: [],
        properties: [],
        stages_chain_id: null
      }
    )
  }

  const handleCreateProject = () => {
    setIsSendData(true)
    if(
      body.name &&
      body.description &&
      body.created_at &&
      body.manager &&
      body.employees.length &&
      body.stages_chain_id
    ) {
      mutate({
        url: clickedProject ? `${API_URL}/project/${projectId}` : `${API_URL}/project/create_project`,
        method: clickedProject ? 'put' : 'post',
        values: body,
        successNotification: (): any => {
          refetch()
          setIsSuccessModal(true)
          handleCloseModal()

          setTimeout(() => {
            setIsSuccessModal(false)
          }, 3000)
        },
        errorNotification: (err: any) => {
          handleCloseModal()

          return {
            message: err.response?.data?.detail ? err.response?.data?.detail : projectId ? 'Не удалось изменить проект' : 'Не удалось создать проект',
            type: 'error',
          }
        },
      })
    }
  }

  useEffect(() => {
    if(clickedProject) {
      const items = {
        name: clickedProject.description.name,
        description: clickedProject.description.description,
        created_at: clickedProject.description.created_at,
        finished_at: clickedProject.description.finished_at,
        checkbox: clickedProject.description.checkbox,
        trade_name: clickedProject.description.trade_name,
        international_nonproprietary_name: clickedProject.description.international_nonproprietary_name,
        chemical_name: clickedProject.description.chemical_name,
        type: clickedProject.description.type,
        pharmacotherapeutic_group_id: clickedProject.description.pharmacotherapeutic_group_id,
        manager: clickedProject?.working_group?.manager?.id,
        employees: clickedProject.working_group?.employees.length ? clickedProject.working_group?.employees.map((el: {id: number}) => el.id) : [],
        pharmaceutical_substances: clickedProject.substances.map((el : {id: number}) => el.id),
        analogues: clickedProject.analogues.map((el : {id: number}) => el.id),
        properties: clickedProject.properties.map((el: any) => {
          return {
            additional_column: el.additional_column,
            additional_value: el.additional_value}
        }),
        stages_chain_id: clickedProject.description.stages_chain_id
      }
      setBody(items)
    }
  }, [clickedProject, isOn])

  return (
    <>
      <Modal
        open={isOn}
        onCancel={handleCloseModal}
        footer={[]}
        style={{
          minWidth: '785px',
          overflow: 'hidden',
          margin: '0 auto'
        }}
      >
        <ModalTitle title={'Проект'}/>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '160px 1fr',
            gap: '15px',
            margin: '16px 0',
            alignItems: 'center',
            maxWidth: '565px'
          }}
        >
          <p
            className={s.description}
          >
            * Название :
          </p>

          <Input
            value={body.name}
            placeholder={'Название*'}
            onChange={(e) => {
              setBody((prevState) => {
                return {
                  ...prevState,
                  name: e.target.value
                }
              })
            }}
            status={isSendData && !body.name ? 'error' : ''}
            style={{
              height: '60px',
              width: '565px'
            }}
            className={s.input}
          />

          <p
            className={s.description}
          >
            * Описание :
          </p>

          <JoditEditor
            ref={editor}
            config={config}
            value={body.description}
            onChange={(value) => {
              setBody((prevState) => {
                return {
                  ...prevState,
                  description: value
                }
              })
            }}
            className={s.input}
          />

          <p
            className={s.description}
          >
            * Сроки :
          </p>
          <div>
            <CalendarComponent
              value={[body.created_at ? dayjs(body.created_at) : '', body.finished_at ? dayjs(body.finished_at) : undefined]}
              onChange={(day) => {
                setBody((prevState) => {
                  return {
                    ...prevState,
                    created_at: toISOStringWithTimezone(day[0].$d).replace(/Z$/, ''),
                    finished_at: toISOStringWithTimezone(day[1].$d).replace(/Z$/, '')
                  }
                })
              }}
              hasError={isSendData && !body.created_at}
              minDate={dayjs(new Date())}
            />
          </div>

          <p
            className={s.description}
          >
            * Руководитель проекта :
          </p>

          <SelectComponent
            selectArray={dataManagersDropDown}
            selectedValue={!body.manager ? undefined : body.manager}
            onChange={(id) => {
              setBody((prevState) => {
                return {
                  ...prevState,
                  manager: Number(id)
                }
              })
            }}
            hasError={isSendData && !body.manager}
            className={s.input}
            style={{
              maxWidth: '565px'
            }}
          />

          <p
            className={s.description}
          >
            * Сотрудники :
          </p>

          <SelectComponent
            isMultiple
            selectArray={dataUsersDropDown}
            onChange={(ids) => {
              setBody((prevState) => {
                return {
                  ...prevState,
                  employees: ids.map((el: string) => Number(el))
                }
              })
            }}
            selectedValue={body.employees}
            hasError={isSendData && !body.employees.length}
            className={s.input}
          />

          <p
            className={s.description}
          >
            * Цепочка этапов :
          </p>

          <SelectComponent
            selectArray={dataChainsDropDown}
            onChange={(id) => {
              setBody((prevState) => {
                return {
                  ...prevState,
                  stages_chain_id: id
                }
              })
            }}
            selectedValue={!body.stages_chain_id ? undefined : body.stages_chain_id}
            hasError={isSendData && !body.stages_chain_id}
            className={s.input}
          />

          <p
            className={s.description}
          >
            Используемые активные фармацевтические субстанции :
          </p>

          <SelectComponent
            selectArray={dataSubstancesDropDown}
            isMultiple
            onChange={(ids) => {
              setBody((prevState) => {
                return {
                  ...prevState,
                  pharmaceutical_substances: ids
                }
              })
            }}
            selectedValue={body.pharmaceutical_substances}
            className={s.input}
          />

          <p
            className={s.description}
          >
            Разработка нового лекарственного препарата :
          </p>

          <Checkbox
            value={body.checkbox}
            onChange={() => {
              setBody((prevState) => {
                return {
                  ...prevState,
                  checkbox: !body.checkbox
                }
              })
            }}
          />


          {body.checkbox &&
            <>
              <p
                className={s.description}
              >
                Торговое наименование разрабатываемого лекарственного препарата :
              </p>
              <Input
                value={body.trade_name}
                onChange={(e) => {
                  setBody((prevState) => {
                    return {
                      ...prevState,
                      trade_name: e.target.value
                    }
                  })
                }}
                className={s.input}
              />
            </>
          }

          {body.checkbox &&
            <>
              <p
                className={s.description}
              >
                Международное непатентованное наименование :
              </p>
              <Input
                value={body.international_nonproprietary_name}
                onChange={(e) => {
                  setBody((prevState) => {
                    return {
                      ...prevState,
                      international_nonproprietary_name: e.target.value
                    }
                  })
                }}
                className={s.input}
              />
            </>
          }

          {body.checkbox &&
            <>
              <p
                className={s.description}
              >
                Химическое наименование :
              </p>
              <Input
                value={body.chemical_name}
                onChange={(e) => {
                  setBody((prevState) => {
                    return {
                      ...prevState,
                      chemical_name: e.target.value
                    }
                  })
                }}
                className={s.input}
              />
            </>
          }

          {body.checkbox &&
            <>
              <p
                className={s.description}
              >
                Тип :
              </p>
              <SelectComponent
                selectArray={typeItems}
                selectedValue={body.type}
                isString
                onChange={(id) => {
                  console.log(id, 'id')
                  setBody((prevState) => {
                    return {
                      ...prevState,
                      type: id
                    }
                  })
                }}
                className={s.input}
              />
            </>
          }

          <>
            <p
              className={s.description}
            >
              Фармакотерапевтическая группа :
            </p>

            <SelectComponent
              selectedValue={!body.pharmacotherapeutic_group_id ? undefined : body.pharmacotherapeutic_group_id }
              selectArray={dataGroupsDropDown}
              onChange={(id) => {
                setBody((prevState) => {
                  return {
                    ...prevState,
                    pharmacotherapeutic_group_id: id
                  }
                })
              }}
              className={s.input}
            />
          </>

          <>
            <p
              className={s.description}
            >
              Аналоги :
            </p>
            <SelectComponent
              className={s.input}
              selectedValue={body.analogues}
              selectArray={dataAnalogsDropDown}
              isMultiple
              onChange={(ids) => {
                setBody((prevState) => {
                  return {
                    ...prevState,
                    analogues: ids
                  }
                })
              }}
            />
          </>
          <AdditionalFields
            setBody={setBody}
            body={body}
          />

        </div>

        <LowButtons
          textOk={'Сохранить'}
          iconOk={save}
          textCancel={'Отменить'}
          iconCancel={close}
          handleClickOk={handleCreateProject}
          handleClickClose={handleCloseModal}
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
