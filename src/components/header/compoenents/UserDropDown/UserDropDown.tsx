import {useNavigate} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import user from '../../../../assets/icons/user.svg'
import styles from "../DirsDropDown/dirs-styles.module.css";
import {Typography} from "antd";
import {useCustomMutation, useLogout} from "@refinedev/core";
import {API_URL} from "../../../../constants/url";

const {Text} = Typography

interface IProps {
  data: any
}

export const UserDropDown = ({data}: IProps) => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const { mutate: logout } = useLogout()
  const { mutate, isLoading } = useCustomMutation<any>()

  const dropdownRef = useRef<any>(null);

  const handleLogout = () => {
    logout()
    mutate({
      url: `${API_URL}/auth/jwt/logout`,
      method: 'post',
      values: {},
    })
  }

  const links = [
    {
      name: 'Личный кабинет',
      link: '/user'
    },
    {
      name: 'Выход',
      link: '/exit'
    },
  ]

  const handleNavigate = (link: string) => {
    if(link === '/user') {
      navigate(link)
    } else  {
      handleLogout()
    }
    setIsOpen(false)
  }

  const handleTrimName = (name: string) => {
    const nameArr = name?.split(' ')

    if(nameArr.length === 1) return name

    return  `${nameArr[0]} ${name[1].slice(0, 1)}.`
  }

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '177px',
      }}
      ref={dropdownRef}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: "pointer",
          width: '100%',
          padding: '13px 15px'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <img src={user}  alt={'user'} />
          <Text
            style={{
              fontSize: '14px',
              color: 'hsla(0, 0%, 0%, 0.85)',
              fontWeight: '500'
            }}
          >
            {data?.data?.username && handleTrimName(data?.data?.username)}
          </Text>
        </div>
      </div>
      {isOpen &&
        <ul
          style={{
            position: 'absolute',
            top: '48px',
            left: '0',
          }}
          className={styles.list}
        >
          {links.map(el => {
            return (
              <li
                className={styles.item}
                onClick={() => handleNavigate(el.link)}
              >
                {el.name}
              </li>
            )
          })}
        </ul>
      }

    </div>
  )
}
