import {useCustom, useCustomMutation} from "@refinedev/core";
import {API_URL} from "../../constants/url";
import {useParams} from "react-router-dom";
import {useContext, useState} from "react";
import {ConfirmDeleteModal} from "../../components/ui/ConfirmDeleteModal";
import {Comments} from "./components/Comments/Comments";
import {AuthContext} from "../../context/AuthProvider";
import {FilesComponent} from "../ProjectDetail/components/FilesComponent/FilesComponent";
import {PageTitle} from "../../components/ui/PageTitle/PageTitle";
import {BreadCrumbs} from "../../components/ui/BreadCrumbs/BreadCrumbs";
import {ArrowComponent} from "../../components/ui/ArrowComponent/ArrowComponent";
import {AboutTask} from "./components/AboutTask/AboutTask";
import {BaseAddButton} from "../../components/ui/BaseAddButton/BaseAddButton";
import comment from '../../assets/icons/comment.svg'
import {CreateComment} from "./modals/CreateComment";
import {AddNewTaskModal} from "../StageDetail/modals/AddNewTaskModal";
import {SuccessModal} from "../../components/ui/successModal/SuccessModal";


export const TaskDetailPage = () => {
  const {taskId, projectId, stageId} = useParams()

  const { mutate, isLoading } = useCustomMutation<any>()

  const { data, refetch } = useCustom({
    url: `${API_URL}/task/${taskId}`,
    method: 'get',
  })

  const { data: dataProject } = useCustom({
    url: `${API_URL}/project/${projectId}`,
    method: 'get',
  })

  const { data: dataStage } = useCustom({
    url: `${API_URL}/project/${projectId}/stage/${stageId}`,
    method: 'get',
  })

  const { userData } = useContext(AuthContext);

  const isCanEditTask = data?.data
    ?   userData?.is_superuser ||
        dataProject?.data?.working_group.manager.user_id_fk === userData?.id ||
        data?.data?.performers.some((el: {user_id_fk: number}) => el.user_id_fk === Number(userData?.id))
    :  false

  const [isDeleteFile, setIsDeleteFile] = useState(false)
  const [clickedFile, setClickedFile] = useState<any>(undefined)
  const [isEditTask, setIsEditTask] = useState(false)

  const [isShowTask, setIsShowTask] = useState(true)
  const [isShowFiles, setIsShowFiles] = useState(true)
  const [isShowComments, setIsShowComments] = useState(true)

  // comments
  const [isCreateComment, setIsCreateComment] = useState(false)
  const [isReplyComment, setIsReplyComment] = useState(false)
  const [clickedCom, setClickedCom] = useState<any>(undefined)

  const [isSuccessModal, setIsSuccessModal] = useState(false)
  const [notificationText, setNotificationText] = useState('')

  const handleAddFile = (file: any, handleCancelModal: () => void) => {
    const formData = new FormData();

    formData.append('file', file)

    mutate({
      url: `${API_URL}/task/${taskId}/upload_file`,
      method: 'post',
      values: formData,
      successNotification: (): any => {
        setNotificationText('Файл добавлен')

        setIsSuccessModal(true)

        setTimeout(() => {
          setIsSuccessModal(false)
        }, 3000)

        refetch()
        handleCancelModal()
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
        url: `${API_URL}/task/${taskId}/file/${clickedFile.id}`,
        method: 'delete',
        values: {},
        successNotification: (): any => {
          setNotificationText('Файл удален')

          setIsSuccessModal(true)

          setTimeout(() => {
            setIsSuccessModal(false)
          }, 3000)

          refetch()
          setIsDeleteFile(false)
          setClickedFile(undefined)
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
    <section
      style={{
        position: 'relative'
      }}
    >
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
          <PageTitle
            text={data?.data?.task?.name}
            link={`/projects/${data?.data?.project_id}/stage/${data?.data?.stage_id}`}
          />
          {isCanEditTask && <BaseAddButton text={'Редактировать'} onClick={() => setIsEditTask(true)} isEdit />}

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
              link: `/projects/${data?.data?.project_id}/stage/${data?.data?.stage_id}`,
              name: `${data?.data?.stage}`
            },
            {
              link: `/`,
              name: `...`
            },
          ]}
        />
      </div>

      <ArrowComponent
        isOn={isShowTask}
        title={'О задаче'}
        content={
          <AboutTask data={data} />
        }
        switchContent={() => setIsShowTask(!isShowTask)}
      />

      <ArrowComponent
        isOn={isShowFiles}
        title={'Файлы'}
        content={
          <FilesComponent
            files={data?.data?.files}
            isCanEdit={!!isCanEditTask}
            setClickedFile={setClickedFile}
            setIsDeleteFile={setIsDeleteFile}
            handleAddFile={handleAddFile}
            title={''}
          />
        }
        switchContent={() => setIsShowFiles(!isShowFiles)}
      />

      <ArrowComponent
        isOn={isShowComments}
        title={'Комментарии'}
        content={
          <Comments
            comments={data?.data?.comments}
            refetch={refetch}
            clickedCom={clickedCom}
            setClickedCom={setClickedCom}
            setIsReplyComment={setIsReplyComment}
          />
        }
        switchContent={() => setIsShowComments(!isShowComments)}
        button={
          <BaseAddButton
            text={'Комментировать'}
            onClick={() => {
              setIsCreateComment(true)
              setClickedCom(undefined)
            }}
            icon={comment}
            isEdit
          />
        }
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

      <CreateComment
        isOn={isCreateComment || isReplyComment}
        off={() => {
          setIsCreateComment(false)
          setIsReplyComment(false)
        }}
        refetch={refetch}
        replyId={clickedCom?.id}
      />


      <AddNewTaskModal
        isOpen={isEditTask}
        off={() => {
          setIsEditTask(false)
        }}
        data={data}
        refetch={refetch}
        clickedTask={data?.data?.task}
        tasks={dataStage?.data?.tasks}
        stageStartDate={dataStage?.data?.stage?.begin_at}
        stageFinishDate={dataStage?.data?.stage?.end_at}
      />

      {isSuccessModal &&
        <SuccessModal
          text={notificationText}
        />
      }
    </section>
  )
}
