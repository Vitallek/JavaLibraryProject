import React from 'react';

import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "./DateRangeBlock.css"
import { Box, Stack, Grid } from '@mui/material';

const DateRangeBlock = ({dateRange, setDateRange}) => {
    
    // new Date().toISOString().split('T')[0]
    return (
      <Stack className='datepicker-wrapper datepicker-shadow'
        sx={{
          ml: 3,
          p: 2,
          mb: 1,
          mt: 1,
        }}
        direction="column"
      >
      <Box item component="span" sx={{
        display: 'flex',
        alignItems: 'center',
      }}
      >
        {'С:'}
      </Box>

      <ReactDatePicker
        dateFormat={"dd/MM/yyyy"}
        selected={dateRange.startDate}
        onChange={(date) => setDateRange(prev => ({...prev, startDate: date}))}
        // selectsStart
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        className={"datepicker-here form-control"}
      />

      <Box item component="span" sx={{
        display: 'flex',
        alignItems: 'center',
        }}
      >
        {'По:'}
      </Box>

      <ReactDatePicker
        dateFormat={"dd/MM/yyyy"}
        selected={dateRange.endDate}
        onChange={(date) => setDateRange(prev => ({...prev, endDate: date}))}

        // selectsEnd
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        className={"datepicker-here form-control"}
      />

    </Stack>
  )
}

export default DateRangeBlock;
