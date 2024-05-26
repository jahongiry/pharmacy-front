import {useCustom} from "@refinedev/core";
import {API_URL} from "../../../constants/url";

export const ProjectHelper = () => {
  const { data: dataGroups } = useCustom({
    url: `${API_URL}/afs/groups`,
    method: 'get',
  })

  const { data: dataSubstances } = useCustom({
    url: `${API_URL}/afs/substances`,
    method: 'get',
  })

  const { data: dataAnalogs } = useCustom({
    url: `${API_URL}/afs/medications`,
    method: 'get',
  })

  const { data: dataEmployees } = useCustom<any[]>({
    url: `${API_URL}/auth/get_employees`,
    method: 'get',
  })

  const { data: dataProjectManagers } = useCustom<any[]>({
    url: `${API_URL}/auth/get_project_managers`,
    method: 'get',
  })


  const { data: dataChains } = useCustom<any[]>({
    url: `${API_URL}/chain/list`,
    method: 'get',
  })

  const dataGroupsDropDown = dataGroups?.data ?
    dataGroups.data.map((el : {id: number; name: string}) => {
      return {
        key: el.id,
        label: el.name
      }
    })
    : []

  const dataSubstancesDropDown = dataSubstances?.data ?
    dataSubstances.data.map((el : {id: number; name: string}) => {
      return {
        key: el.id,
        label: el.name
      }
    })
    : []

  const dataAnalogsDropDown = dataAnalogs?.data ?
    dataAnalogs.data.map((el : {id: number; name: string}) => {
      return {
        key: el.id,
        label: el.name
      }
    })
    : []

  const dataUsersDropDown = dataEmployees?.data ?
    dataEmployees.data.map((el : {id: number; username: string}) => {
      return {
        key: String(el.id),
        label: el.username
      }
    })
    : []

  const dataManagersDropDown = dataProjectManagers?.data ?
    dataProjectManagers.data.map((el : {id: number; username: string}) => {
      return {
        key: String(el.id),
        label: el.username
      }
    })
    : []

  const dataChainsDropDown = dataChains?.data ?
    dataChains.data.map((el : {id: number; name: string}) => {
      return {
        key: String(el.id),
        label: el.name
      }
    })
    : []

  return {
    dataGroupsDropDown,
    dataAnalogsDropDown,
    dataSubstancesDropDown,
    dataUsersDropDown,
    dataManagersDropDown,
    dataChainsDropDown
  }
}
