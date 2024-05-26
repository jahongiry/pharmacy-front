import {Typography} from "antd";

const {Text} = Typography

export const ProjectHelpers = () => {
  const leftColumn = (text: string) => {
    return (
      <th
        style={{
          border: '1px solid hsla(0, 0%, 0%, 0.06)',
          verticalAlign: 'top',
          padding: '8px',
          borderTop: '1px solid #dcebf7 !important',
          backgroundColor: 'hsla(233, 100%, 98%, 1)',
          textAlign: 'right',
          width: '100%',
          maxWidth: '260px',
          minWidth: '260px',
          display: 'block',
          fontWeight: '400',
          minHeight: '100%'
        }}
      >
        <p
          style={{
            color: 'hsla(0, 0%, 0%, 0.85)'
          }}
        >
          {text}
        </p>

      </th>
    )
  }

  const rightColumn = (text?: string | string[] | any[], isUser?: boolean) => {
    return (
      <td
        style={{
          border: '1px solid hsla(0, 0%, 0%, 0.06)',
          verticalAlign: 'top',
          whiteSpace: 'normal !important',
          padding: '8px',
          width: '100%',
        }}
      >
        <div
          style={{
            gap: '5px',
            display: 'flex',
            flexDirection: 'column',
            wordBreak: 'break-word',
            maxWidth: '95%',
            whiteSpace: 'pre-line'
          }}
        >

          {
            Array.isArray(text)
              ? text.map((el: any, index: number) => <Text key={index}>{isUser ? el.username : el.name}</Text>)
              : <Text>{text}</Text>
          }
        </div>

      </td>
    )
  }


  return {rightColumn, leftColumn}
}
