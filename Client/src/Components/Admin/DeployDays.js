import { Button, Card, Grid } from '@mui/material';
import axios from 'axios';
import "primeflex/primeflex.css";
import { Carousel } from 'primereact/carousel';
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { useEffect, useState } from 'react';

const DeployDays = () => {
  return (
    <Grid>
      <iframe style={{width: '100%', height: '100vh'}} src='https://deploy-calendar.ru/all/'>

      </iframe>
    </Grid>
  )
}

export default DeployDays