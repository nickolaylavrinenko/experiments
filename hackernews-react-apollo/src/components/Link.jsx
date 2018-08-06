
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { graphql } from 'react-apollo';
// import gql from 'graphql-tag';
import { timeDifferenceForDate } from '../utils';

class Link extends Component {
  static displayName = 'Link'
  static propTypes = {
    link: PropTypes.shape({
      id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      created: PropTypes.object.isRequired,
      // votes: PropTypes.arrayOf(PropTypes.object),
      postedBy: PropTypes.shape({
        id: PropTypes.number.isRequired,
        username: PropTypes.string.isRequired,
        email: PropTypes.string
      })
    }).isRequired,
    index: PropTypes.number.isRequired
    // createVoteMutation: PropTypes.func.isRequired
  }

  // _voteForLink = async () => {
  //   const userId = localStorage.getItem(GC_USER_ID_KEY);
  //   // const voterIds = this.props.link.votes.map(vote => vote.user.id);

  //   if (voterIds.includes(userId)) {
  //     console.log(`User (${ userId }) already voted for this link.`);
  //     return;
  //   }

  //   const linkId = this.props.link.id;

  //   await this.props.createVoteMutation({
  //     variables: {
  //       userId,
  //       linkId
  //     },
  //     update: (store, { data: { createVote } }) => {
  //       this.props.updateStoreAfterVote(store, createVote, linkId);
  //     }
  //   })
  // }

  render() {
    // const userId = localStorage.getItem(GC_USER_ID_KEY);
    const { link, index } = this.props;

    return (
      <div className='flex mt2 items-start'>
        <div className='flex items-center'>
          <span className='gray'>{ index + 1 }.</span>
          { /* userId && <div className='ml1 gray f11 pointer' onClick={() => this._voteForLink()}>▲</div> */ }
        </div>
        <div className='ml1'>
          <div>{ link.description } ({ link.url })</div>
          <div className='f6 lh-copy gray'>
            {/* link.votes.length */}
            {/* &nbsp;votes | by&nbsp;*/ }
            { link.postedBy ?
                link.postedBy.username :
                'Unknown' }
            &nbsp;
            { timeDifferenceForDate(link.createdAt) }
          </div>
        </div>
      </div>
    );
  }
}

// const CREATE_VOTE_MUTATION = gql`
//   mutation CreateVoteMutation($userId: ID!, $linkId: ID!) {
//     createVote(userId: $userId, linkId: $linkId) {
//       id
//       link {
//         votes {
//           id
//           user {
//             id
//           }
//         }
//       }
//       user {
//         id
//       }
//     }
//   }
// `

// export default graphql(CREATE_VOTE_MUTATION, {
//   name: 'createVoteMutation'
// })(Link);

export default Link;
