import React, {useEffect, useRef, useState} from "react";
import dirs from '../../../../assets/icons/dirs.svg'
import {Typography} from "antd";
import arrowDown from '../../../../assets/icons/arrowDown.svg'
import styles from './dirs-styles.module.css'
import {useNavigate} from "react-router-dom";

const {Text} = Typography

export const DirsDropDown = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const dropdownRef = useRef<any>(null);

  const links = [
    {
      name: 'Этапы',
      link: '/stages'
    },
    {
      name: 'Цепочки',
      link: '/chains'
    },
    {
      name: 'Статусы',
      link: '/statuses'
    }
  ]

  const handleNavigate = (link: string) => {
    navigate(link)
    setIsOpen(false)
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
        marginLeft: '-10px'
      }}
      ref={dropdownRef}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
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
          <img src={dirs}  alt={'dirs'} />
          <Text
            style={{
              fontSize: '14px',
              color: 'hsla(0, 0%, 0%, 0.85)',
              fontWeight: '500'
            }}
          >
            Справочники
          </Text>
        </div>

        <img
          src={arrowDown}
          alt={'arrow'}
          style={{
            marginLeft: '15px',
            marginTop: '2px',
            transform: !isOpen ? 'rotate(0deg)' : 'rotate(180deg)',
          }}
        />
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
