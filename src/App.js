import React from 'react';

import { Amplify, Hub, Auth } from "aws-amplify";
import { DataStore } from "@aws-amplify/datastore";
import config from './aws-exports';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignIn } from '@aws-amplify/ui-react';

import Navbar from './components/Navbar';
import MessageDisplay from './components/MessageDisplay'

import { Message } from './models';

import { useState, useEffect } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';


Amplify.configure(config);
DataStore.configure(config);

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#4f5b62',
      main: '#263238',
      dark: '#000a12',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#f44336',
      main: '#ff7961',
      dark: '#ba00d',
      contrastText: '#000000',
    },
  },
});

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [initialData, setInitialData] = useState({
    messages: [],
  })

  React.useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        setUser(user)
        console.log(user)
        if ((user.signInUserSession.accessToken.payload["cognito:groups"]).includes("admin")) {
          setIsAdmin(true);
        }
      })
      .catch(() => console.log('No signed in user.'))

    Hub.listen('auth', data => {
      switch (data.payload.event) {
        case 'signIn':
          if ((user.signInUserSession.accessToken.payload["cognito:groups"]).includes("admin")) {
            setIsAdmin(true);
          }
          return setUser(data.payload.data);
        case 'signOut':
          return setUser(null);
      }
    });
  }, [])  

  useEffect(() => {
    const removeListener = Hub.listen("datastore", async (capsule) => {
      const {
        payload: { event, data },
      } = capsule;
      // console.log(event, data)
      if (event === "ready") {
        fetchData();
      }
    });

    DataStore.start();

    return () => {
      removeListener();
    };
  }, []);

  async function fetchData() {
    setInitialData({
      messages: await DataStore.query(Message),
    })
  }

  if (user) {
    return (
      <ThemeProvider theme={theme}>
        <Box height='100%' display='flex' flexDirection='column' alignItems='center'>
          <Navbar user={user} />
          <MessageDisplay user={user} isAdmin={isAdmin} initialData={initialData} />
        </Box>
      </ThemeProvider>
    );
  } else {
    return (
      <Box style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>
        <AmplifyAuthenticator>
          <AmplifySignIn headerText='Welcome to the Message Board!' slot='sign-in'></AmplifySignIn>
          <AmplifySignUp
            slot='sign-up'
            formFields={[
              { type: 'username' },
              { type: 'password' },
              { type: 'email' },
            ]}
          />
        </AmplifyAuthenticator>
      </Box> 
    )
  }
}

export default App;