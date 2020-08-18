import React from 'react';

import { Auth } from "aws-amplify";
import { DataStore } from "@aws-amplify/datastore";
import { Message } from '../models';

import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { Button, AppBar, Toolbar, Typography, Menu, MenuItem, Box, TextField, Paper, Modal, Divider, InputAdornment } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

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
  notchedOutline: {
    borderWidth: '1px',
    borderColor: 'white !important'
  },
}));

function CreateMessage(props) {
  const classes = useStyles();

  const [message, setMessage] = useState('');

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  }

  const handleClose = () => {
    props.close();
  }

  async function handleCreate() {
    const newMessage = new Message({
      author: props.username,
      message: message,
      updatedOn: new Date().toISOString(),
    })

    await DataStore.save(newMessage);

    setMessage('');
    props.close();
  }

  const modalBody = (
    <Paper elevation={5} className={classes.modal}>
      <Box className={classes.rowFlexBox}>
        <h3 style={{flexGrow:1}}>Create a Message</h3>
        <Button onClick={handleCreate} style={{marginRight: theme.spacing(2)}}>Create Message</Button>
        <Button onClick={handleClose} style={{marginRight: theme.spacing(2)}}><CloseIcon /></Button>
      </Box>
      <Divider />
      <TextField
      variant='outlined'
      placeholder='create a message...'
      multiline
      rows={10}
      onChange={handleMessageChange}
      style={{width: '100%', marginTop: theme.spacing(2)}}
      >

      </TextField>
    </Paper>
  );

  return (
    <>
      <Modal
      open={props.show}
      onClose={handleClose}
      disableBackdropClick={true}
      >
        {modalBody}
      </Modal>
    </>
  );
}

export default function Navbar(props) {
  const classes = useStyles();
  
  const username = props.authenticatedUser.username;

  const [showCreateMessage, setShowCreateMessage] = useState(false);

  const toggleCreateMessageModal = () => {
    setShowCreateMessage(!showCreateMessage);
  }

  function UserDropDown() {
    const [anchorEl, setAnchorEl] = React.useState(null);
  
    const handleClick = (e) => {
      setAnchorEl(e.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const handleLogout = () => {
      setAnchorEl(null);
      DataStore.clear();
      Auth.signOut();
    };
  
    return (
      <>
        <Button 
        color='inherit'
        onClick={handleClick}
        disableRipple={true}
        >
          {username + "'s Profile"}
          <ArrowDropDownIcon />
        </Button>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          transitionDuration={0}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          getContentAnchorEl={null}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </>
    );
  }

  function SearchBar() {
    const [searchQuery, setSearchQuery] = useState();

    const handleTextFieldChange = (e) => {
      setSearchQuery(e.target.value)
    }

    const handleSearch = () => {
      alert('Searched for: ' + searchQuery)
    }

    return (
      <Box className={classes.rowFlexBox} style={{marginRight: theme.spacing(3)}}>
        <SearchIcon onClick={handleSearch} />
      </Box>
    )
  }

  const userList = [
    {username: 'alex'},
    {usermame: 'alex2'},
  ]

  const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 }, ]

  return (
    <>
      <AppBar position='static'>
        <Toolbar style={{height:'5vh'}}>
          <Typography variant='h6' style={{flexGrow:1}}>
            {username}
          </Typography>
          <Autocomplete
            freeSolo
            // options={userList.map(user => user)}
            options={top100Films.map((option) => option.title)}
            renderInput={(params) => (
              <TextField 
              {...params}
              margin="dense"
              variant="outlined"
              InputProps={{
                classes: {
                  notchedOutline: classes.notchedOutline,
                },
                inputMode: "numeric",
              }}
              />
            )}
          />
          <Button onClick={toggleCreateMessageModal} style={{marginRight: theme.spacing(3)}} color='inherit'>Create Message</Button>
          <UserDropDown />
        </Toolbar>
      </AppBar>
      <CreateMessage
      show={showCreateMessage}
      close={toggleCreateMessageModal}
      username={username}
      />
    </>
  )
}