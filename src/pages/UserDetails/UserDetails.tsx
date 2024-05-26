import {useState} from "react";
import {Button} from "antd";
import {UserTasksTable} from "./components/UserTasksTable";
import {UserProjectsTable} from "./components/UserProjectsTable";
import {UpdateUser} from "../Users/modals/UpdateUser";
import {useCustom} from "@refinedev/core";
import {API_URL} from "../../constants/url";
import {PageTitle} from "../../components/ui/PageTitle/PageTitle";
import {ArrowComponent} from "../../components/ui/ArrowComponent/ArrowComponent";
import {UserData} from "./components/UserData/UserData";

export const UserDetails = () => {
  const [isEdit, setIsEdit] = useState(false)
  const [typeEdit, setTypeEdit] = useState('password')

  const [isShowData, setIsShowData] = useState(true)
  const [isShowProject, setIsShowProject] = useState(true)
  const [isShowTasks, setIsShowTasks] = useState(true)

  const { data, refetch } = useCustom<any>({
    url: `${API_URL}/auth/update_user/me`,
    method: 'get',
  })

  const userData = data?.data



  return (
    <section>
      <PageTitle text={'Личный кабинет'}/>

      <ArrowComponent
        isOn={isShowData}
        title={'Данные'}
        content={
          <UserData  userData={userData} setIsEdit={setIsEdit} setTypeEdit={setTypeEdit}/>
        }
        switchContent={() => setIsShowData(!isShowData)}
      />

      <ArrowComponent
        isOn={isShowProject}
        title={'Проекты'}
        content={ <UserProjectsTable />}
        switchContent={() => setIsShowProject(!isShowProject)}
        styles={{
          marginTop: '48px'
        }}
      />

      <ArrowComponent
        isOn={isShowTasks}
        title={'Задачи'}
        content={ <UserTasksTable />}
        switchContent={() => setIsShowTasks(!isShowTasks)}
      />


      <UpdateUser
        isOpen={isEdit}
        off={() => setIsEdit(false)}
        user={userData}
        refetch={refetch}
        editByUser
        typeEdit={typeEdit}
      />
    </section>
  )
}
