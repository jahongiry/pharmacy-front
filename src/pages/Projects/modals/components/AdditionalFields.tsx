import {Button, Input, Typography} from "antd";
import {Dispatch, SetStateAction} from "react";
import {BodyTypes} from "../CreateNewProjectModal";
import s from "../../../Directories/pages/StagesDir/modals/CreateAndEditStageModal/index.module.css";
import trash from '../../../../assets/icons/trash.svg'

const {Link} = Typography
interface IProps {
  setBody: Dispatch<SetStateAction<BodyTypes>>
  body: BodyTypes
}
export const AdditionalFields = ({setBody, body}: IProps) => {
  return (
    <>
      <div></div>
      <Link
        style={{

          display: 'block'
        }}
        onClick={() => {
          setBody((prevState) => {
            return {
              ...prevState,
              properties: [...body.properties, {
                additional_column: "",
                additional_value: ""
              }]
            }
          })
        }}
      >
        + Добавить текстовое поле
      </Link>
      <>
        {body.properties.map((item, i) => {
          return (
            <>
              <div></div>
              <div
                style={{
                  display: 'flex',
                  gap: '5px',
                  width: '100%',
                  alignItems: 'center',
                  marginLeft: '-55px'
                }}
              >
                <p
                  className={s.description}
                  style={{
                    marginLeft: '-10px'
                  }}
                >
                  Название :
                </p>
                <Input
                  className={s.input}
                  placeholder={'Название'}
                  value={item.additional_column}
                  onChange={(e) => {
                    setBody((prevState) => {
                      const updatedProperties = [...prevState.properties];
                      updatedProperties[i].additional_column = e.target.value;
                      return {
                        ...prevState,
                        properties: updatedProperties
                      };
                    });
                  }}
                  style={{
                    width: '170px'
                  }}
                />

                <p
                  className={s.description}
                  style={{
                    marginLeft: '20px'
                  }}
                >
                  Описание :
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Input
                    className={s.input}
                    placeholder={'Описание'}
                    value={item.additional_value}
                    onChange={(e) => {
                      setBody((prevState) => {
                        const updatedProperties = [...prevState.properties];
                        updatedProperties[i].additional_value = e.target.value;
                        return {
                          ...prevState,
                          properties: updatedProperties
                        };
                      });
                    }}
                    style={{
                      width: '170px'
                    }}
                  />

                  <button
                    onClick={() => {
                      const filterProperties = body.properties.filter((_, index) => i !== index)
                      setBody((prevState) => {
                        return {
                          ...prevState,
                          properties: filterProperties
                        }
                      })
                    }}
                    style={{
                      marginLeft: '15px'
                    }}
                  >
                    <img src={trash} alt={'trash'}/>
                  </button>
                </div>

              </div>

            </>
          )
        })}

      </>
    </>
  )
}
