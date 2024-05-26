import {useNavigate, useParams} from "react-router-dom";
import {useCustom} from "@refinedev/core";
import {API_URL} from "../../../../constants/url";
import {ProjectHelpers} from "../../../ProjectDetail/ProjectHelpers";
import {PageTitle} from "../../../../components/ui/PageTitle/PageTitle";
import {BreadCrumbs} from "../../../../components/ui/BreadCrumbs/BreadCrumbs";
import s from './index.module.css'

export const ChainDetailPage = () => {
  const {chainId} = useParams()

  const { data: dataChain } = useCustom<any>({
    url: `${API_URL}/chain/${chainId}`,
    method: 'get',
  })


  const {rightColumn, leftColumn} = ProjectHelpers()

  return (
    <section>
      <PageTitle text={`${dataChain?.data?.chain_name}`} link={'/chains'} />

      <BreadCrumbs
        links={[
          {
            link: '/',
            name: 'Справочники'
          },
          {
            link: `/chains`,
            name: `Цепочки`
          },
          {
            link: `/`,
            name: `...`
          },
        ]}
      />
      <div
        style={{
          display: 'flex',
          gap: '20px',
          flexDirection: 'column',
          margin: '25px 0 50px 0'
        }}
      >
        {dataChain?.data?.list_stages_info?.map((el: any) => {
          return (
            <div
              style={{
                display: 'flex',
                gap: '10px'
              }}
            >
              {el.map((item: any) => {
                return (
                  <div
                    style={{
                      width: '100%',
                      margin: '30px 0'
                    }}
                  >
                    <p className={s.title}>Этап: {item?.stage?.name}</p>
                    <table
                      style={{
                        background: 'white',
                        minWidth: '100%',
                        display: 'grid',
                        height: '70%'
                      }}
                    >

                      <tr
                        style={{
                          display: 'flex',
                          minHeight: '100%'
                        }}
                      >
                        {leftColumn('Этапы-последователи')}
                        {rightColumn(item?.followers?.length ? item.followers : 'Не указаны')}
                      </tr>
                      <tr
                        style={{
                          display: 'flex',
                          minHeight: '100%'
                        }}
                      >
                        {leftColumn('Этапы-предшественники')}
                        {rightColumn(item?.predecessors?.length ? item.predecessors : 'Не указаны')}
                      </tr>
                    </table>
                  </div>

                )
              })}
            </div>
          )
        })}
      </div>

    </section>
  )
}
