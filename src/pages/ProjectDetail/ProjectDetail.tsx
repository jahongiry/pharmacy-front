import {useCustom, useCustomMutation} from "@refinedev/core";
import {API_URL} from "../../constants/url";
import { useParams} from "react-router-dom";
import 'moment/dist/locale/ru'
import {StagesTable} from "./components/StagesTable";
import {useContext, useState} from "react";
import {ConfirmDeleteModal} from "../../components/ui/ConfirmDeleteModal";
import {CreateNewProjectModal} from "../Projects/modals/CreateNewProjectModal";
import {AuthContext} from "../../context/AuthProvider";
import {FilesComponent} from "./components/FilesComponent/FilesComponent";
import {PageTitle} from "../../components/ui/PageTitle/PageTitle";
import {BaseAddButton} from "../../components/ui/BaseAddButton/BaseAddButton";
import {ArrowComponent} from "../../components/ui/ArrowComponent/ArrowComponent";
import {AboutProject} from "./components/AboutProject/AboutProject";
import {SuccessModal} from "../../components/ui/successModal/SuccessModal";


export const ProjectDetail = () => {
  const {projectId} = useParams()
  const [isDeleteFile, setIsDeleteFile] = useState(false)

  const [isShowDetails, setIsShowDetails] = useState(true)
  const [isShowFiles, setIsShowFiles] = useState(true)
  const [isShowStages, setIsShowStages] = useState(true)

  const [clickedFile, setClickedFile] = useState<any>(undefined)
  const [columnId, setColumnId] = useState(0)

  const [isEditProject, setIsEditProject] = useState(false)

  const [successText, setSuccessText] = useState('')
  const [isSuccessModal, setIsSuccessModal] = useState(false)

  const { mutate } = useCustomMutation<any>()

  const { data, refetch } = useCustom({
    url: `${API_URL}/project/${projectId}`,
    method: 'get',
  })

  const { userData } = useContext(AuthContext);

  const isCanEditProject = data?.data
    ?  userData?.is_superuser || data.data.working_group.manager.user_id_fk === userData?.id
    :  false

  const isCanEditStageUsers = data?.data
    ?  userData?.is_superuser ||
    data.data?.working_group.manager.user_id_fk === userData?.id ||
    data.data?.working_group.employees.some((el: any) => el.user_id_fk === userData?.id)
    :  false

  const handleAddFile = (file: any) => {

    const formData = new FormData();

    formData.append('file', file)

    mutate({
      url: `${API_URL}/project/${projectId}/upload_file`,
      method: 'post',
      values: formData,
      successNotification: (): any => {
        refetch()

        setSuccessText('Файл добавлен')

        setIsSuccessModal(true)

        setTimeout(() => {
          setIsSuccessModal(false)
        }, 3000)
      },
      errorNotification: (err) => {

        return {
          message: 'Не удалось добавить файл',
          type: 'error',
        }
      },
    })
  }

  const handleDeleteFile = () => {
    if(clickedFile) {
      mutate({
        url: `${API_URL}/project/${projectId}/file/${clickedFile.id}`,
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
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          marginBottom: '20px'
        }}
      >
        <PageTitle text={data?.data?.description?.name} link={'..'} />
        {isCanEditProject &&
          <BaseAddButton
            text={'Редактировать'}
            onClick={() => {
              setIsEditProject(true)
            }}
            isEdit
          />
        }
      </div>

      <ArrowComponent
        isOn={isShowDetails}
        title={'О проекте'}
        content={
          <AboutProject data={data}/>
        }
        switchContent={() => setIsShowDetails(!isShowDetails)}
      />

      <ArrowComponent
        isOn={isShowFiles}
        title={'Файлы'}
        content={
          <FilesComponent
            files={data?.data?.files}
            isCanEdit={isCanEditStageUsers || isCanEditProject}
            setClickedFile={setClickedFile}
            setIsDeleteFile={setIsDeleteFile}
            handleAddFile={handleAddFile}
            title={''}
          />
        }
        switchContent={() => setIsShowFiles(!isShowFiles)}
      />


      <ArrowComponent
        isOn={isShowStages}
        title={'Этапы'}
        content={
          <StagesTable
            dataProject={data}
          />
        }
        styles={{
          marginTop: '30px'
        }}
        switchContent={() => setIsShowStages(!isShowStages)}
      />

      <ConfirmDeleteModal
        isOn={isDeleteFile}
        off={() => setIsDeleteFile(false)}
        handleOk={handleDeleteFile}
        title={'Удалить файл?'}
      />

      {isEditProject &&
        <CreateNewProjectModal
          isOn={isEditProject}
          handleCancel={() => {
            setIsEditProject(false)
          }}
          refetch={refetch}
          clickedProject={data?.data}
        />
      }
      {isSuccessModal &&
        <SuccessModal
          text={successText}
        />
      }
    </section>
  )
}
