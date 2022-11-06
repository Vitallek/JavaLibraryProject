import React from "react";
import { Grid, Typography, Avatar, Paper } from "@mui/material";

const imgLink =
  "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260";

const  CommentsComponent = ({comments}) => {
  return (
    <Grid>
      <Typography
        fontSize={30}
      >
        {'Comments'}
      </Typography>
      {comments.map((comment, index) => {
        return (
          <Paper key={index} style={{ padding: "40px 20px" }}>
            <Grid container wrap="nowrap" spacing={2}>
              <Grid item>
                <Avatar alt="Remy Sharp" src='./profileMock.jpg' />
              </Grid>
              <Grid justifyContent="left" item xs zeroMinWidth>
                <h4 style={{ margin: 0, textAlign: "left" }}>{comment.author}</h4>
                <p style={{ textAlign: "left" }}>
                  {comment.text}
                </p>
                <p style={{ textAlign: "left", color: "gray" }}>
                  {`posted ${new Date(parseInt(comment.date)).toLocaleString()}`}
                </p>
              </Grid>
            </Grid>
          </Paper>
        )
      })}
    </Grid>
  );
}
export default CommentsComponent