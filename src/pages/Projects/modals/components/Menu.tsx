import {Menu} from "antd";

interface IProps {
  setMenuItem: (el: string) => void
  menuItem: string
}

export const MenuComponent = ({setMenuItem, menuItem}: IProps) => {
  const items = [
    {
      label: 'Вакцина',
      key: 'vaccine',
    },
    {
      label: 'Антибиотик',
      key: 'antibiotic',
    },
    {
      label: 'Прочие лекарственные средства',
      key: 'others',
    },
  ]

  return (
    <Menu
      style={{ marginBottom: '10px' }}
      items={items}
      onClick={(data) => setMenuItem(data.key)}
      selectedKeys={[menuItem]}
    />
  )
}
