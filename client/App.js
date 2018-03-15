import React, { Component } from 'react';
import styled from 'styled-components';
import TextAreaContainer from './TextAreaContainer';
import Title from './Title';
import Input from './Input';
import Button from './Button';
import * as APIUtil from './util';

const Wrapper = styled.section`
  margin: 40px 0;
  padding: 3em;
  width: 400px;
  font-family: 'Pangram';

  @media (max-width: 850px) {
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    padding: 1em;
    border-radius: 0;
  }
`;

const UserInputWrapper = styled.div`
  box-sizing: border-box;
  width: 400px;
  @media (max-width: 850px) {
    width: 100%;
    box-sizing: border-box;
  }
`;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = { input: '', currentState: 'initial', username: '', goal: '', content: '' };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.transition = this.transition.bind(this);
    this.receiveContent = this.receiveContent.bind(this);
  }

  transition(option = 'next'){
      const uiStates = {
        'initial': {'next': 'greeting'},
        'greeting': {
          'existing': 'welcBack',
          'new': 'welcNewUser'
        },
        'welcBack': {'next': 'confirmGoal'},
        'welcNewUser': {'next': 'confirmGoal'},
        'confirmGoal': {
          'yes': 'content',
          'no': 'retry'
        },
        'retry': {'next': 'confirmGoal'}
      };
      const newState = uiStates[this.state.currentState][option];

      this.setState({
        currentState: newState,
        input: ``
      });
  }

  handleInputChange(event) {
    this.setState({
      input: event.target.value,
    });
  }

  receiveUser(input){
    APIUtil.fetchUser(input)
    .then((user) => {
      console.log(user);
      if(user.status === 200){
        this.setState({
          username: user.data.name,
          goal: user.data.goal
        });

        this.transition('existing');
      } else {
        this.transition('new');
      }
    });
  }

  receiveContent(){
    APIUtil.fetchContent(this.state.goal)
    .then((res) => {
      this.setState({
        content: res.data.content
      });
    });
  }

  handleClick(event) {
    const currentState = this.state.currentState;
    const input = this.state.input;

    if (currentState === 'initial' && input === 'Hi'){
      this.transition();
    } else if (currentState === 'greeting'){
      this.receiveUser(input);
    }
  }

  render() {
    return (
      <Wrapper>
        <Title>Shine Bot</Title>
        <TextAreaContainer username={ this.state.username } goal={this.state.goal} content={this.state.content} currentState={this.state.currentState}/>
        <UserInputWrapper>
          <Input
            onChange={this.handleInputChange}
            value={this.state.input}
            type="text"
            placeholder="User Response"
          />
          <Button onClick={this.handleClick}>Send</Button>
        </UserInputWrapper>
      </Wrapper>
    );
  }
}
