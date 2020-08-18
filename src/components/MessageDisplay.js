import React from 'react';

import { DataStore } from "@aws-amplify/datastore";
import { Message } from '../models';

import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { Typography, Box, Grid, Paper, Divider } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const theme = createMuiTheme();

const useStyles = makeStyles((theme) => ({
  rowFlexBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modal: {
    position: 'absolute',
    width: '60%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minHeight: '38%',
    maxHeight: '38%',

    padding: theme.spacing(0, 2, 2, 2),
    outline: 0,
  },
  messageCard: {
    padding: theme.spacing(0, 2, 2, 2),
    height: '25vh',
    background: '#f2eecb',
  },
}));

function DisplayedMessage(props) {
  const classes = useStyles();
  
  var message = props.message;

  const handleDeleteClick = () => {
    DataStore.delete(message);
  }

  return (
    <Grid item xs={3} key={message.updatedOn}>
      <Paper className={classes.messageCard} style={{overflow: 'auto'}}>
        <Box className={classes.rowFlexBox} style={{padding:theme.spacing(1)}}>
          <Typography style={{flexGrow:1}}>{(new Date(message.updatedOn)).toDateString()}</Typography>
          {(props.isAdmin || props.user.username === message.owner) &&
          <DeleteIcon onClick={handleDeleteClick} />}
        </Box>
        <Divider />
        <Typography style={{textAlign:'center', fontWeight:'bold', marginTop:theme.spacing(1)}}>{message.owner}</Typography>
        <Typography style={{textAlign:'center'}}>{message.message}</Typography>
      </Paper>
    </Grid>
  )
}

export default function MessageDisplay(props) {
  const classes = useStyles();

  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    setMessageList(props.initialData.messages)
  }, [props.initialData.messages])

  useEffect(() => {
    const messageSubscription = DataStore.observe(Message).subscribe(message => {
      console.log(message)
      updateMessages()
    });

    return () => messageSubscription.unsubscribe();
  }, [])

  async function updateMessages() {
    setMessageList(await DataStore.query(Message));
  }

  const sortAndSplit = (list) => {
    const newList = [...list];
    newList.sort((a,b) => {
      return (a.updatedOn > b.updatedOn) ? -1 : ((a.updatedOn < b.updatedOn) ? 1 : 0);
    })
    return newList.splice(0,12);
  }

  return (
    <Grid container spacing={3} style={{padding:theme.spacing(2), height:'100%', width:'100%'}}>
      {sortAndSplit(messageList).map(message => {
        return (
          <DisplayedMessage
          user={props.user}
          isAdmin={props.isAdmin}
          message={message}
          key={message.id} />
        )
      })}
    </Grid>
  )
}