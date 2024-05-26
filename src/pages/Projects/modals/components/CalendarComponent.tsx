import {Calendar} from "antd";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import locale from 'antd/es/date-picker/locale/ru_RU';
import './calendar.css'

import { DatePicker } from "antd";

interface IProps {
  onChange: (day: any) => void
  value?: [any, any]
  hasError?: boolean
  minDate: any
  maxDate?: any
  disabledDate?: any
}
export const CalendarComponent = (
  {
    onChange,
    value,
    hasError,
    minDate,
    maxDate,
    disabledDate
  }: IProps
) => {
  const { RangePicker } = DatePicker

  return (
    <div style={{
      minWidth: '100%',
      position: 'relative'
    }}>
      <RangePicker
        locale={locale}
        minDate={minDate}
        maxDate={maxDate}
        inputReadOnly
        onChange={onChange}
        value={value}
        disabledDate={disabledDate}
        status={hasError ? 'error' : ''}
      />
    </div>
  )
}
