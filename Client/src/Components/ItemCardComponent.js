import { useContext, useEffect, useState, useRef } from 'react';
import { Stack, Card, CardActions, CardContent, CardMedia, Button, Typography, Rating } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { UserInfoContext } from '../UserInfoContext';
import { Toast } from 'primereact/toast';
import { Button as PrimeButton } from 'primereact/button'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const width = '200px'
const cardStyle = {
  minWidth: 250,
  maxWidth: 250,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: '370px',
  maxHeight: '370px',
  m: 2,
}
export const BookItemCard = ({ book }) => {
  const navigate = useNavigate()
  return (
    <Card
      sx={{...cardStyle}}
    >
      <CardMedia
        component="img"
        height={150}
        image={book.image}
        alt="фото книги"
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
          <Typography component="legend">{`(${parseInt(book.rate_amount)})`}</Typography>
        </Typography>
      </CardContent>
      <CardActions>
        {book.links?.length > 0 ?
          <Button onClick={_ => navigate(`/book/${book.key}`)}>
            Перейти
          </Button>
          :
          <Button onClick={_ => navigate(`/book/${book.key}`)} color='inherit'>
            Недоступно
          </Button>
        }
      </CardActions>
    </Card>
  );
}
export const AuthorItemCard = ({ author }) => {
  return (
    <Card
      sx={{...cardStyle}}
    >
      <CardMedia
        component="img"
        height={200}
        image={author.image}
        alt="фото автора"
      />
      <CardContent>
        <strong>{author.author_name}</strong>
      </CardContent>
      <CardContent>
        <Typography display='flex' alignItems='center'>
          <Typography component="legend">{parseFloat(author.rate).toFixed(1)}</Typography>
          <Rating name="read-only" value={author.rate} readOnly />
          <Typography component="legend">{`(${parseInt(author.rate_amount)})`}</Typography>
        </Typography>
      </CardContent>
    </Card>
  );
}
export const SubjectItemCard = ({ subject }) => {
  return (
    <Card
      sx={{...cardStyle}}
    >
      <CardMedia
        component="img"
        height={200}
        image={subject.image}
        alt="фото жанра"
      />
      <CardContent>
        <strong>{subject.subject}</strong>
      </CardContent>
      <CardContent>
        <Typography display='flex' alignItems='center'>
          <Typography component="legend">{parseFloat(subject.rate).toFixed(1)}</Typography>
          <Rating name="read-only" value={subject.rate} readOnly />
          <Typography component="legend">{`(${parseInt(subject.rate_amount)})`}</Typography>
        </Typography>
      </CardContent>
    </Card>
  );
}