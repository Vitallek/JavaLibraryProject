import { useContext, useEffect, useState, useRef } from 'react';
import { Stack, Card, CardActions, CardContent, CardMedia, Button, Typography, Rating } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { UserInfoContext } from '../../UserInfoContext';
import { Toast } from 'primereact/toast';
import { Button as PrimeButton } from 'primereact/button'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const width = '200px'
export const BookItemCard = ({ book, bookIndex }) => {
  const navigate = useNavigate()
  const toast = useRef(null)
  return (
    <Card
      key={bookIndex}
      sx={{
        minWidth: 200,
         maxWidth: width,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '350px',
        m: 2
      }}
    >
      <Toast ref={toast} position="bottom-right" />
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
        <Button onClick={_ => navigate(`/item${book.key}`)}>
          Explore
        </Button>
        :
        <Button 
          disabled
        >
          Unavailable
        </Button>
        }
      </CardActions>
    </Card>
  );
}
export const AuthorItemCard = ({ author, authorIndex }) => {
  const toast = useRef(null)
  return (
    <Card
      key={authorIndex}
      sx={{
        minWidth: 200,
         maxWidth: width,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '350px',
        m: 2
      }}
    >
      <Toast ref={toast} position="bottom-right" />
      <CardMedia
        component="img"
        height={200}
        image={author.image}
        alt="author image"
      />
      <CardContent>
        <div>
          <span>{author.author_name}</span>
        </div>
      </CardContent>
      <CardContent>
        <Typography display='flex' alignItems='center'>
          <Typography component="legend">{parseFloat(author.rate).toFixed(1)}</Typography>
          <Rating name="read-only" value={Math.floor(author.rate)} readOnly />
        </Typography>
      </CardContent>
    </Card>
  );
}
export const SubjectItemCard = ({ subject, subjectIndex }) => {
  const toast = useRef(null)
  return (
    <Card
      key={subjectIndex}
      sx={{
        minWidth: 200,
         maxWidth: width,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '350px',
        m: 2
      }}
    >
      <Toast ref={toast} position="bottom-right" />
      <CardMedia
        component="img"
        height={200}
        image={subject.image}
        alt="author image"
      />
      <CardContent>
        <div>
          <span>{subject.subject}</span>
        </div>
      </CardContent>
      <CardContent>
        <Typography display='flex' alignItems='center'>
          <Typography component="legend">{parseFloat(subject.rate).toFixed(1)}</Typography>
          <Rating name="read-only" value={Math.floor(subject.rate)} readOnly />
        </Typography>
      </CardContent>
    </Card>
  );
}