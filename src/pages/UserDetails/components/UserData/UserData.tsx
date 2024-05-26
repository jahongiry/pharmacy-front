import s from './user.module.css'
import lock from '../../../../assets/icons/Lock.svg'
import edit from '../../../../assets/icons/edit.svg'
import {Dispatch, SetStateAction} from "react";

interface IProps {
  userData: any
  setIsEdit: Dispatch<SetStateAction<boolean>>
  setTypeEdit: Dispatch<SetStateAction<string>>
}
export const UserData = (
  {
    userData,
    setIsEdit,
    setTypeEdit
  }: IProps
) => {
  return (
    <div
      className={s.box}
    >
      <div
        className={s.block}
      >
        <p
          className={s.title}
        >
          Имя и фамилия:
        </p>
        <p
          className={s.description}
        >
          {userData?.username}
        </p>
        <p
          className={s.title}
        >
          Адрес электронной почты:
        </p>
        <p
          className={s.description}
        >
          {userData?.email}
        </p>

        <p
          className={s.title}
        >
          Роли пользователя:
        </p>
        <p
          className={s.description}
        >
          Сотрудник{' '}
          {userData?.is_project_manager && <span>Руководитель проектов</span>}{' '}
          {userData?.is_superuser && <span>Администратор</span>}
        </p>

      </div>
      <div
        className={s.block}
      >
        <div
          className={s.link}
          onClick={() => {
            setIsEdit(true)
            setTypeEdit('name')
          }}
        >
          <img src={edit} alt={'edit'}/>
          <span>Изменить данные</span>
        </div>
        <div></div>

        <div
          className={s.link}
          onClick={() => {
            setIsEdit(true)
            setTypeEdit('password')
          }}
        >
          <img src={lock} alt={'lock'}/>
          <span>Изменить пароль</span>
        </div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>

      </div>

    </div>
  )
}


// <table
//   style={{
//     background: 'white',
//     minWidth: '100%'
//   }}
// >
//   <thead />
//   <tbody
//     style={{
//       display: 'table-row-group',
//       verticalAlign: 'middle',
//       borderColor: 'inherit'
//     }}
//   >
//   <tr
//     style={{
//       display: 'flex'
//     }}
//   >
//     {leftColumn('Имя и фамилия')}
//     {rightColumn(userData?.username)}
//   </tr>
//   <tr
//     style={{
//       display: 'flex'
//     }}
//   >
//     {leftColumn('Адрес электронной почты')}
//     {rightColumn(userData?.email)}
//   </tr>
//   <tr
//     style={{
//       display: 'flex'
//     }}
//   >
//     {leftColumn('Роль пользователя')}
//     <td
//       style={{
//         border: '1px dotted #dcebf7',
//         verticalAlign: 'top',
//         whiteSpace: 'normal !important',
//         padding: '8px',
//         width: '100%',
//       }}
//     >
//       <div
//         style={{
//           gap: '5px',
//           display: 'flex',
//           flexDirection: 'column',
//           wordBreak: 'break-word',
//           maxWidth: '95%',
//           whiteSpace: 'pre-line'
//         }}
//       >
//         <Text>Сотрудник</Text>
//         {userData?.is_project_manager && <Text>Руководитель проектов</Text> }
//         {userData?.is_superuser && <Text>Администратор</Text>}
//       </div>
//     </td>
//   </tr>
//   </tbody>
// </table>
