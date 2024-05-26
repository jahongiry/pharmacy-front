import {Select} from "antd";
import {CSSProperties} from "react";

interface IProps {
  isMultiple?: boolean
  selectArray: {
    key: string
    label: string
  }[]
  placeholder?: string
  selectedValue?: string[] | number | number[] | string
  onChange?: (ids: any) => void
  isString?: boolean
  hasError?: boolean
  style?: CSSProperties
  className?: string
}
export const SelectComponent = (
  {
    isMultiple,
    selectArray,
    placeholder,
    selectedValue,
    onChange,
    isString,
    hasError,
    style,
    className
  }: IProps
) => {

  return (
    <Select
      mode={isMultiple ? "multiple" : undefined}
      onChange={onChange}
      style={{borderRadius: '4px', minHeight: '38px', minWidth: '100%', ...style}}
      placeholder={placeholder}
      showSearch={false}
      value={selectedValue}
      status={hasError ? 'error' : ''}
      className={className}
    >
      {selectArray?.map(el => {
        return (
          <Select.Option value={isString ? String(el.key) : Number(el.key)}>{el.label}</Select.Option>
        )
      })}
    </Select>
  )
}
