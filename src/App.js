import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Amplify } from "aws-amplify";
import { DataStore } from "@aws-amplify/datastore";
import config from './aws-exports';

import { Message } from './models';

Amplify.configure(config);
DataStore.configure(config);

export default function App() {

  async function createMessage() {
    await DataStore.save(new Message({
      author: 'Jane Doe',
      message: 'Test Message!',
      updatedOn: new Date().toISOString(),
    }));
  }

  async function readMessages() {
    console.log(await DataStore.query(Message));
    const messages = (await DataStore.query(Message)).map(messageModel => messageModel.message);
    alert(messages.join(', '));
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={createMessage}>Create Message</button>
        <button onClick={readMessages}>Read Messages</button>
      </header>
    </div>
  );
}