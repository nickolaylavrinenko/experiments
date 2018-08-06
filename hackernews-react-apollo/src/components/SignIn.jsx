import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import {
  GC_USER_ID_KEY,
  GC_USER_NAME_KEY,
  GC_USER_EMAIL_KEY,
  GC_AUTH_TOKEN_KEY
} from '../constants'

class SignIn extends Component {
  static displayName = 'SignIn'
  static propTypes = {
    createUserMutation: PropTypes.func.isRequired,
    signInUserMutation: PropTypes.func.isRequired
  }

  state = {
    signIn: true, // switch between Sign In and Sign Up
    username: '',
    email: '',
    password: '',
  }

  _confirm = async () => {
    const { username, email, password, signIn } = this.state;
    let result = null;

    if (signIn) {
      result = await this.props.signInUserMutation({
        variables: {
          username,
          password
        }
      });
    } else {
      result = await this.props.createUserMutation({
        variables: {
          username,
          email,
          password
        }
      });
    }

    if (result) {
      console.log('!!!', result.data);
      const id = result.data.signInUser.user.id;
      const token = result.data.signInUser.user.token;
      const email = result.data.signInUser.user.email;

      this._saveUserData(id, username, email, token);
    }
    this.props.history.push(`/`);
  }

  _saveUserData = (id, username, email, token) => {
    localStorage.setItem(GC_USER_ID_KEY, id);
    localStorage.setItem(GC_USER_NAME_KEY, email);
    localStorage.setItem(GC_USER_EMAIL_KEY, email);
    localStorage.setItem(GC_AUTH_TOKEN_KEY, token);
  }

  render() {
    return (
      <div>
        <h4 className='mv3'>{this.state.signIn ? 'Sign In' : 'Sign Up'}</h4>
        <div className='flex flex-column'>
          
          <input
              value={this.state.username}
              onChange={(e) => this.setState({ username: e.target.value })}
              type='text'
              placeholder='username' />
          { !this.state.signIn &&
              <input
                  value={this.state.email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                  type='text'
                  placeholder='Your email address' /> }
          <input
              value={this.state.password}
              onChange={(e) => this.setState({ password: e.target.value })}
              type='password'
              placeholder='Choose a safe password' />
        </div>
        <div className='flex mt3'>
          <div
              className='pointer mr2 button'
              onClick={() => this._confirm()}>
            {this.state.signIn ? 'Sign In' : 'Create Account' }
          </div>
          <div
              className='pointer button'
              onClick={() => this.setState({ signIn: !this.state.signIn })}>
            {this.state.signIn ? 'need to create an account?' : 'already have an account?'}
          </div>
        </div>
      </div>
    );
  }
}

const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation($username: String!, $email: String!, $password: String!) {
    createUser(
      username: $username,
      email: $email,
      password: $password
    ) {
      user {
        id
      }
    }

    signInUser(
      username: $username,
      password: $password
    ) {
      user {
        id,
        username,
        email,
        token
      }
    }
  }
`

const SIGNIN_USER_MUTATION = gql`
  mutation SignInUserMutation($username: String!, $password: String!) {
    signInUser(
      username: $username,
      password: $password
    ) {
      user {
        id,
        username,
        email,
        token
      }
    }
  }
`

export default compose(
  graphql(CREATE_USER_MUTATION, { name: 'createUserMutation' }),
  graphql(SIGNIN_USER_MUTATION, { name: 'signInUserMutation' })
)(SignIn);
