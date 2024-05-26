import React, {useContext} from "react";
import {Typography} from "antd";
import gear from '../../../assets/icons/gear.svg'
import users from '../../../assets/icons/users.svg'
import projects from '../../../assets/icons/projects.svg'
import {DirsDropDown} from "./DirsDropDown/DirsDropDown";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../../context/AuthProvider";

const {Text} = Typography
export const NavigateButtons = () => {
  const navigate = useNavigate()

  const { userData } = useContext(AuthContext);

  const headerNavigate = (text: string, icon: any, link: string) => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          cursor: "pointer"
        }}
        onClick={() => navigate(link)}
      >
        <img src={icon}  alt={'icon'} />
        <Text
          style={{
            fontSize: '14px',
            color: 'hsla(0, 0%, 0%, 0.85)',
            fontWeight: '500'
          }}
        >
          {text}
        </Text>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '35px'
      }}
    >
      <Text
        style={{
          color: 'hsla(209, 84%, 40%, 1)',
          fontSize: '18px',
          fontWeight: '700',
          lineHeight: '24px',
          marginTop: '-5px'
        }}
      >
        Фарматол
      </Text>
      {headerNavigate('Мои задачи', gear, '/myTasks')}
      {headerNavigate('Проекты', projects, '/projects')}
      {userData?.is_superuser && headerNavigate('Пользователи', users, '/users')}
      <DirsDropDown />
    </div>
  )
}
