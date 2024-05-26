import { useParams} from "react-router-dom";
import {useCustom, useCustomMutation} from "@refinedev/core";
import {API_URL} from "../../constants/url";
import {TaskTable} from "./components/TaskTable/TaskTable";
import {useContext, useState} from "react";
import {ConfirmDeleteModal} from "../../components/ui/ConfirmDeleteModal";
import {AuthContext} from "../../context/AuthProvider";
import {FilesComponent} from "../ProjectDetail/components/FilesComponent/FilesComponent";
import {PageTitle} from "../../components/ui/PageTitle/PageTitle";
import {BreadCrumbs} from "../../components/ui/BreadCrumbs/BreadCrumbs";
import {ArrowComponent} from "../../components/ui/ArrowComponent/ArrowComponent";
import {AboutStage} from "./components/AboutStage/AboutStage";
import {BaseAddButton} from "../../components/ui/BaseAddButton/BaseAddButton";
import {SuccessModal} from "../../components/ui/successModal/SuccessModal";
import {AddStage} from "../ProjectDetail/modals/AddStage";

export const StageDetail = () => {
  const {projectId, stageId} = useParams()

  const { mutate, isLoading } = useCustomMutation<any>()

  const [isEditStage, setIsEditStage] = useState(false)

  const [isAddNewTask, setIsAddNewTask] = useState(false)
  const [isDeleteFile, setIsDeleteFile] = useState(false)
  const [clickedFile, setClickedFile] = useState<any>()

  const [isShowDetails, setIsShowDetails] = useState(true)
  const [isShowFiles, setIsShowFiles] = useState(true)

  const [isSuccessModal, setIsSuccessModal] = useState(false)
  const [successText, setSuccessText] = useState('')


  const { data, refetch } = useCustom({
    url: `${API_URL}/project/${projectId}/stage/${stageId}`,
    method: 'get',
  })

  const { data: dataProject } = useCustom({
    url: `${API_URL}/project/${projectId}`,
    method: 'get',
  })


  const { userData } = useContext(AuthContext);

  const isCanEditStageAdmin = data?.data
    ?  userData?.is_superuser ||
       dataProject?.data?.working_group.manager.user_id_fk === userData?.id
    :  false

  const isCanEditStageUsers = data?.data
    ?  userData?.is_superuser ||
    dataProject?.data?.working_group.manager.user_id_fk === userData?.id ||
    dataProject?.data?.working_group.employees.some((el: any) => el.user_id_fk === userData?.id)
    :  false

  const handleAddFile = (file: any, handleCancelModal: () => void) => {
    const formData = new FormData();

    formData.append('file', file)

    mutate({
      url: `${API_URL}/project/${projectId}/stage/${data?.data.stage.id}/upload_file`,
      method: 'post',
      values: formData,
      successNotification: (): any => {
        refetch()
        handleCancelModal()

        setSuccessText('Файл добавлен')

        setIsSuccessModal(true)

        setTimeout(() => {
          setIsSuccessModal(false)
        }, 3000)
      },
      errorNotification: (err) => {
        handleCancelModal()

        return {
          message: 'Не удалось добавить файл',
          type: 'error',
        }
      },
    })
  }

  const handleDeleteFIle = () => {
    if(clickedFile) {
      mutate({
        url: `${API_URL}/project/${projectId}/stage/${stageId}/file/${clickedFile.id}`,
        method: 'delete',
        values: {},
        successNotification: (): any => {
          refetch()
          setIsDeleteFile(false)
          setClickedFile(undefined)

          setSuccessText('Файл удален')

          setIsSuccessModal(true)

          setTimeout(() => {
            setIsSuccessModal(false)
          }, 3000)
        },
        errorNotification: (err) => {
          setIsDeleteFile(false)
          setClickedFile(undefined)

          return {
            message: 'Не удалось удалить файл',
            type: 'error',
          }
        },
      })
    }
  }

  return (
    <section>
      <div
        style={{
          marginBottom: '15px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <PageTitle text={data?.data?.stage?.stage} link={`/projects/${data?.data?.project_id}`} />
          <BaseAddButton text={'Редактировать'} onClick={() => setIsEditStage(true)} isEdit />

        </div>


        <BreadCrumbs
          links={[
            {
              link: '/projects',
              name: 'Проекты'
            },
            {
              link: `/projects/${data?.data?.project_id}`,
              name: `${data?.data?.project}`
            },
            {
              link: `/`,
              name: `...`
            },
          ]}
        />

      </div>

      <ArrowComponent
        isOn={isShowDetails}
        title={'Об этапе'}
        content={
          <AboutStage data={data}/>
        }
        switchContent={() => setIsShowDetails(!isShowDetails)}
      />

      <ArrowComponent
        isOn={isShowFiles}
        title={'Файлы'}
        content={
          <FilesComponent
            files={data?.data?.files}
            isCanEdit={isCanEditStageUsers || isCanEditStageAdmin}
            setClickedFile={setClickedFile}
            setIsDeleteFile={setIsDeleteFile}
            handleAddFile={handleAddFile}
            title={''}
          />
        }
        switchContent={() => setIsShowFiles(!isShowFiles)}
      />

      <ArrowComponent
        isOn={isShowDetails}
        title={'Задачи'}
        content={
          <TaskTable
            isAddNewTask={isAddNewTask}
            setIsAddNewTask={setIsAddNewTask}
            isCanEditStage={isCanEditStageUsers}
            dataStage={data}
          />
        }
        button={isCanEditStageUsers && <BaseAddButton text={'Добавить задачу'} onClick={() => setIsAddNewTask(true)} />}
        switchContent={() => setIsShowDetails(!isShowDetails)}
        styles={{
          marginTop: '50px'
        }}
      />

      <ConfirmDeleteModal
        isOn={isDeleteFile}
        off={() => setIsDeleteFile(false)}
        handleOk={handleDeleteFIle}
        title={'Удалить файл?'}
      />

      {isSuccessModal &&
        <SuccessModal
          text={successText}
        />
      }

      <AddStage
        isOn={isEditStage}
        off={() => setIsEditStage(false)}
        projectFinishDate={dataProject?.data?.description.finished_at}
        projectStartDate={dataProject?.data?.description.created_at}
        refetch={refetch}
        clickedStage={data?.data}
        dataProject={dataProject}
      />
    </section>
  )
}
