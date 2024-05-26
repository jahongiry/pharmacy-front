import {Dispatch, SetStateAction, useContext, useState} from "react";
import {AuthContext} from "../../../../context/AuthProvider";
import {ConfirmDeleteModal} from "../../../../components/ui/ConfirmDeleteModal";
import {useCustomMutation} from "@refinedev/core";
import {API_URL} from "../../../../constants/url";
import s from './index.module.css'
import trash from '../../../../assets/icons/trash.svg'
import comment from '../../../../assets/icons/commentBlue.svg'
import subtract from '../../../../assets/icons/Subtract.svg'
import {SuccessModal} from "../../../../components/ui/successModal/SuccessModal";

interface IProps {
  comments: any
  refetch: any
  clickedCom: Record<string, any>
  setClickedCom: Dispatch<SetStateAction<any>>
  setIsReplyComment: Dispatch<SetStateAction<boolean>>
}
export const Comments = ({comments, refetch, clickedCom, setClickedCom, setIsReplyComment}: IProps) => {
  const [isDeleteComment, setIsDeleteComment] = useState(false)

  const { mutate, isLoading } = useCustomMutation<any>()

  const { userData } = useContext(AuthContext);

  const isAdmin = userData?.is_superuser

  const [isSuccessModal, setIsSuccessModal] = useState(false)


  const handleDelete = () => {
    mutate({
      url: `${API_URL}/comment/${clickedCom.id}`,
      method: 'delete',
      values: {},
      successNotification: (): any => {
        refetch()
        setIsDeleteComment(false)

        setIsSuccessModal(true)

        setTimeout(() => {
          setIsSuccessModal(false)
        }, 3000)
      },
      errorNotification: (err) => {
        setIsDeleteComment(false)

        return {
          message: 'Не удалось удалить комментарий',
          type: 'error',
        }
      },
    })
  }

  return (
    <div
      style={{
        margin: '20px 0 40px 0'
      }}
    >
      {comments?.length > 0 &&
        <div
          className={s.wrapper}
        >
          {comments.map((el: any) => {
           return (
             <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                paddingBottom: '10px',
                gap: '10px'
              }}
             >
               <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
               >
                 <div
                   style={{
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'flex-start',
                     gap: '10px'
                   }}
                 >
                   <p
                     className={s.author}
                   >
                     {el?.author}
                   </p>
                   <div dangerouslySetInnerHTML={{ __html: `${el.text}`}} className={s.textComment} />
                   <button
                     onClick={() => {
                       setClickedCom(el)
                       setIsReplyComment(true)
                     }}
                     className={s.btn}
                   >
                     <img src={comment} alt={'comment'} />
                     <span>Ответить</span>

                   </button>
                 </div>

                 {(isAdmin || userData?.id === el.author_id) &&
                   <img
                     onClick={() => {
                       setIsDeleteComment(true)
                       setClickedCom(el)
                     }}
                     src={trash}
                     alt={'icon'}
                     style={{
                       width: '16px',
                       height: '16px',
                       cursor: 'pointer',
                       marginTop: '16px'
                     }}
                   />
                 }
               </div>

               {el?.replies?.length > 0 &&
                   <div>
                     {el?.replies.map((el: any) => {
                       return (
                         <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                          }}
                         >
                           <div
                             style={{
                               display: 'flex',
                               flexDirection: 'row',
                               alignItems: 'center',
                               gap: '20px'
                             }}
                           >
                             <img src={subtract} alt={'icon'}/>
                             <div
                               style={{
                                 display: 'flex',
                                 flexDirection: 'column',
                                 paddingBottom: '10px',
                                 gap: '10px',
                                 marginTop: '10px'
                               }}
                             >
                               <p
                                 className={s.author}
                               >
                                 {el?.author}
                               </p>
                               <div dangerouslySetInnerHTML={{ __html: `${el.text}`}} />
                             </div>
                           </div>

                           {(isAdmin || userData?.id === el.author_id) &&
                             <img
                               onClick={() => {
                                 setIsDeleteComment(true)
                                 setClickedCom(el)
                               }}
                               src={trash}
                               alt={'icon'}
                               style={{
                                 width: '16px',
                                 height: '16px',
                                 cursor: 'pointer'
                               }}
                             />
                           }

                         </div>
                       )
                     })}
                   </div>
               }
             </div>
           )
          })}
        </div>
      }

      <ConfirmDeleteModal
        isOn={isDeleteComment}
        off={() => setIsDeleteComment(false)}
        handleOk={handleDelete}
        title={'Удалить комменатрий?'}
      />
      {isSuccessModal &&
        <SuccessModal
          text={'Комментарий удален'}
        />
      }
    </div>
  )
}
