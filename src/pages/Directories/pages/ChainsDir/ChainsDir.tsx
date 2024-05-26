import {ChainsTable} from "../StagesDir/components/ChainsTable/ChainsTable";
import {useCustom} from "@refinedev/core";
import {API_URL} from "../../../../constants/url";

export const ChainsDir = () => {
  const { data: dataStages, refetch } = useCustom<any[]>({
    url: `${API_URL}/stage/get_stages`,
    method: 'get',
  })
  return (
    <ChainsTable dataStages={dataStages}/>
  )
}
