import React, { useState } from 'react';
import ProteusAI from "@proteus-ai/sdk";
import './style.css';

const APIKEY = ''
const options = {
  apiKey: APIKEY,
  baseUrl: ""
};

const proteus = new ProteusAI(options);

const Explore = () => {
  const [inputName, setInputName] = useState('');
  const [inputRole, setInputRole] = useState('');
  const [inputLoc, setInputLoc] = useState('');
  const [inputYOE, setInputYOE] = useState('');
  const [inputInd, setInputInd] = useState('');
  const [outputText, setOutputText] = useState('');

  const handleInputChange = (e) => {
    switch (e.target.name) {
      case 'name':
        setInputName(e.target.value)
        break;
      case 'role':
        setInputRole(e.target.value)
        break;
      case 'ind':
        setInputInd(e.target.value)
        break;
      case 'loc':
        setInputLoc(e.target.value)
        break; 
      case 'exp':
        setInputYOE(e.target.value)
        break;
      default:
        break;
    };
  };
  const sendMessage = async () => {
    const payload = {
      conversationId: '66893ad75924d7911dded395',
      type: "TEXT",
      content: `With the following details, "Name: ${inputName}, years of experience: ${inputYOE}, last role: ${inputRole}, industry: ${inputInd} preferred location: ${inputLoc} recommend a job for ${inputName}.`
    }
    await proteus.messages.sendMessage(payload);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    // await sendMessage();
    const conversation = await proteus.conversations.getConversationById("66893ad75924d7911dded395", {page: 1, limit: 10});
    console.log({ conversation });
  };

  proteus.messages.on('MESSAGE_SEND', (data) => {
    console.log({data});
    const message = data.body
    if (message.isStreaming) {
      setOutputText(message.content);
    } else {
      console.log('This message has now been fully constructed');
      // setOutputText(message.content);
    }
  });
  proteus.connected(async () => {
    console.log('Connected to ProteusAI');
  });

  return (
    <div className="form-container">
      <h2 className="form-title">Explore</h2>
      <form onSubmit={handleSubmit}>
        <label className="form-label">
          Name:
          <input
            type="text"
            value={inputName}
            name='name'
            onChange={handleInputChange}
            className="form-input"
            placeholder="Type something..."
          />
        </label>
        <label className="form-label">
          Years of experience:
          <input
            name='exp'
            type="text"
            value={inputYOE}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Type something..."
          />
        </label>
        <label className="form-label">
          Industry:
          <input
            type="text"
            name='ind'
            value={inputInd}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Type something..."
          />
        </label>
        <label className="form-label">
          Location:
          <input
            type="text"
            name='loc'
            value={inputLoc}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Type something..."
          />
        </label>
        <label className="form-label">
          role:
          <input
            type="text"
            name='role'
            value={inputRole}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Type something..."
          />
        </label>
        <button type="submit" className="form-button">Submit</button>
      </form>
      <div className="output-container">
        <h3 className="output-title">Output:</h3>
        <p className="output-text">{outputText}</p>
      </div>
    </div>
  );
};

export default Explore;
