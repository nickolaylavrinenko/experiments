import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_LINKS_QUERY } from './LinkList';
// import { LINKS_PER_PAGE } from '../constants';

class CreateLink extends Component {
  static displayName = 'CreateLink'
  static propTypes = {
    createLinkMutation: PropTypes.func.isRequired
  }

  state = {
    description: '',
    url: ''
  }

_createLink = async () => {
  const postedById = null;

  if (!postedById) {
    console.error('No user logged in');
    return;
  }

  const { createLinkMutation } = this.props;
  const { url, description } = this.state;

  await createLinkMutation({
    variables: {
      url,
      description
    },
    update: (store, { data: { createLink } }) => {
      // const first = LINKS_PER_PAGE;
      // const skip = 0;
      // const orderBy = 'createdAt_DESC';
      const data = store.readQuery({
        query: ALL_LINKS_QUERY,
        // variables: { first, skip, orderBy }
      });

      data.allLinks.splice(0, 0, createLink);
      // data.allLinks.pop();
      store.writeQuery({
        query: ALL_LINKS_QUERY,
        data,
        // variables: { first, skip, orderBy }
      });
    }
  });
  // this.props.history.push(`/new/1`);
  this.props.history.push(`/new`);
}

  render() {
    return (
      <div>
        <div className='flex flex-column mt3'>
          <input
            className='mb2'
            value={this.state.url}
            onChange={(e) => this.setState({ url: e.target.value })}
            type='text'
            placeholder='enter URL for the link' />
          <input
            className='mb2'
            value={this.state.description}
            onChange={(e) => this.setState({ description: e.target.value })}
            type='text'
            placeholder='enter description for the link' />
        </div>
        <button onClick={() => this._createLink()}>
          Submit
        </button>
      </div>
    );
  }
}

const CREATE_LINK_MUTATION = gql`
  mutation CreateLinkMutation($url: String!, $description: String!) {
    createLink(
      url: $url,
      description: $description
    ) {
      link {
        id
        url
        description
        postedBy {
          id
          username
          email
        }
        created
      }
    }
  }
`

export default graphql(CREATE_LINK_MUTATION, { name: 'createLinkMutation' })(CreateLink);
