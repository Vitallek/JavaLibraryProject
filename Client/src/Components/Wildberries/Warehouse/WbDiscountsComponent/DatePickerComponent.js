import React from 'react';

import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "./DatePickerComponent.css"
import { Stack, IconButton } from '@mui/material';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';

const DatePickerComponent = ({date, setDate}) => {
    
    // new Date().toISOString().split('T')[0]
    return (
      <>
        <ReactDatePicker
          dateFormat={"yyyy-MM-dd HH:mm"}
          selected={date}
          onChange={(date) => setDate(date)}
          timeInputLabel="Time:"
          showTimeInput
          className={"datepicker-here form-control"}
          shouldCloseOnSelect={false}
        />
        <Stack spacing={1} direction="row">
          <IconButton onClick={e => setDate('')}>
            <RestartAltRoundedIcon/>
          </IconButton>
          <IconButton onClick={e => setDate(new Date())}>
            <AccessTimeRoundedIcon/>
          </IconButton>
        </Stack>
      </>
    )
}

export default DatePickerComponent;
