import React, { useContext, useEffect, useRef, useState } from "react";
import { Grid, Typography, Avatar, Paper, IconButton, TextField, Box } from "@mui/material";
import { Stack } from "@mui/system";
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { UserInfoContext } from "../../UserInfoContext";
import axios from "axios";
const enterKey = 13
const escapeKey = 27
const  CommentsComponent = ({comments,bookKey}) => {
  const [commentsState, setComments] = useState(comments)
  const userInfoContext = useContext(UserInfoContext)
  const [isEditComment, setIsEditComment] = useState({
    state: false,
    id: 0
  })
  useEffect(() => {
    setComments(comments)
  },[comments])

  const handleEditComment = (comment) => {
    setIsEditComment({id: comment.id, state: !isEditComment.state})
  }
  const onCommentEditComplete = (e, comment) => {
    if(e.keyCode === enterKey){
      const newComments = [...commentsState]
      let editedCommentIndex = newComments.findIndex(el => el.id === comment.id)
      newComments[editedCommentIndex].text = e.target.value
      newComments[editedCommentIndex].edited = `${new Date().getTime()}`
      setIsEditComment({id: comment.id, state: !isEditComment.state})
      updateComment({...comment, text: e.target.value, edited: `${new Date().getTime()}`})
      setComments(newComments)
    }
    if(e.keyCode === escapeKey) setIsEditComment(prev => ({...prev,state: !isEditComment.state}))
  }
  const updateComment = (comment) => {
    axios.put(`http://${process.env.REACT_APP_SERVER_ADDR}/update-comment/${bookKey}/${comment.id}/${userInfoContext.token}`, JSON.stringify(comment))
      .then(response => console.log(response))
      .catch(err => console.log(err))
  }
  const handleDeleteComment = (comment) => {
    const newComments = [...commentsState]
    let deleteCommentIndex = newComments.findIndex(el => el.id === comment.id)
    newComments.splice(deleteCommentIndex,1)
    setComments(newComments)
    axios.delete(`http://${process.env.REACT_APP_SERVER_ADDR}/delete-comment/${bookKey}/${comment.id}/${userInfoContext.token}`)
      .then(response => console.log(response))
      .catch(err => console.log(err))
  }
  return (
    <Grid>
      <Typography
        fontSize={30}
      >
        {'Comments'}
      </Typography>
      {commentsState.map((comment, index) => {
        return (
          <Paper key={index} sx={{mb:1, p:2, maxWidth:'90%'}}>
            <Grid container spacing={2}>
              <Grid item xs={1}>
                <Avatar alt="Remy Sharp" src='./profileMock.jpg' />
              </Grid>
              <Grid justifyContent="left" item xs={10}>
                <h4 style={{ margin: 0, textAlign: "left" }}>{comment.author}</h4>
                <Box style={{ textAlign: "left" }}>
                  {comment.id !== isEditComment.id || !isEditComment.state ? `${comment.text}` :
                    <TextField
                      sx={{minWidth: '100%'}}
                      label="Maximum length: 1000"
                      multiline
                      rows={5}
                      inputProps={{ maxLength: 1000 }}
                      defaultValue={comment.text}
                      variant="filled"
                      onKeyDown={(e) => onCommentEditComplete(e, comment)}
                    />
                  }
                </Box>
                <p style={{ textAlign: "left", color: "gray" }}>
                  {comment.edited ? 
                  `edited ${new Date(parseInt(comment.edited)).toLocaleString()}`
                  :
                  `posted ${new Date(parseInt(comment.date)).toLocaleString()}`
                }
                </p>
              </Grid>
              {userInfoContext.auth && userInfoContext.email === comment.email && 
                <Grid item xs={1}>
                  <Stack direction="column" spacing={2}>
                    <IconButton onClick={() => handleEditComment(comment)}>
                      <EditIcon/>
                    </IconButton>
                    <IconButton onClick={() => handleDeleteComment(comment)}>
                      <HighlightOffIcon/>
                    </IconButton>
                  </Stack>
                </Grid>
              }
            </Grid>
          </Paper>
        )
      })}
    </Grid>
  );
}
export default CommentsComponent