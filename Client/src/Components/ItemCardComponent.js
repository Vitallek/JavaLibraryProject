import { useContext, useEffect, useState, useRef } from 'react';
import { Stack, Card, CardActions, CardContent, CardMedia, Button, Typography, Rating } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { UserInfoContext } from '../UserInfoContext';
import { Toast } from 'primereact/toast';
import { Button as PrimeButton } from 'primereact/button'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const width = '200px'
export const BookItemCard = ({ book }) => {
  const navigate = useNavigate()
  return (
    <Card
      sx={{
        minWidth: 200,
        maxWidth: width,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '450px',
        m: 2
      }}
    >
      <CardMedia
        component="img"
        height={200}
        image={book.image}
        alt="book image"
      />
      <CardContent>
        <div>
          <strong>{book.title}</strong>{` - `}<br />
          <span>{book.author_name}</span>

        </div>
      </CardContent>
      <CardContent>
        <Typography display='flex' alignItems='center'>
          <Typography component="legend">{parseFloat(book.rate).toFixed(1)}</Typography>
          <Rating name="read-only" value={Math.floor(book.rate)} readOnly />
        </Typography>
      </CardContent>
      <CardActions>
        {book.links?.length > 0 ?
          <Button onClick={_ => navigate(`/book/${book.key}`)}>
            Explore
          </Button>
          :
          <Button onClick={_ => navigate(`/book/${book.key}`)} color='inherit'>
            Unavailable
          </Button>
        }
      </CardActions>
    </Card>
  );
}
export const AuthorItemCard = ({ author }) => {
  return (
    <Card
      sx={{
        minWidth: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '350px',
        m: 2
      }}
    >
      <CardMedia
        component="img"
        height={200}
        image={author.image}
        alt="green iguana"
      />
      <CardContent>
        <strong>{author.author_name}</strong>
      </CardContent>
      <CardContent>
        <Typography display='flex' alignItems='center'>
          <Typography component="legend">{parseFloat(author.rate).toFixed(1)}</Typography>
          <Rating name="read-only" value={author.rate} readOnly />
        </Typography>
      </CardContent>
    </Card>
  );
}
export const SubjectItemCard = ({ subject }) => {
  return (
    <Card
      sx={{
        minWidth: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '350px',
        m: 2
      }}
    >
      <CardMedia
        component="img"
        height={200}
        image={subject.image}
        alt="green iguana"
      />
      <CardContent>
        <strong>{subject.subject}</strong>
      </CardContent>
      <CardContent>
        <Typography display='flex' alignItems='center'>
          <Typography component="legend">{parseFloat(subject.rate).toFixed(1)}</Typography>
          <Rating name="read-only" value={subject.rate} readOnly />
        </Typography>
      </CardContent>
    </Card>
  );
}