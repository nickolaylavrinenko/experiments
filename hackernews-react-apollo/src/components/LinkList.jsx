import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Link from './Link';
// import { LINKS_PER_PAGE } from '../constants';

class LinkList extends Component {
  static displayName = 'LinkList'
  static propTypes = {
    allLinksQuery: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.object,
      allLinks: PropTypes.arrayOf(PropTypes.object),
      subscribeToMore: PropTypes.func.isRequired
    }),
    mode: PropTypes.oneOf([
      'new', 'top'
    ]),
    history: PropTypes.object
  }
  static defaultProps = {
    mode: 'new'
  }

  // componentDidMount() {
  //   this._subscribeToNewLinks();
  //   this._subscribeToNewVotes();
  // }

  // _updateCacheAfterVote = (store, createVote, linkId) => {
  //   const isNewPage = this.props.location.pathname.includes('new');
  //   const page = parseInt(this.props.match.params.page, 10);
  //   const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
  //   const first = isNewPage ? LINKS_PER_PAGE : 100;
  //   const orderBy = isNewPage ? "createdAt_DESC" : null;
  //   const data = store.readQuery({
  //     query: ALL_LINKS_QUERY,
  //     variables: { first, skip, orderBy }
  //   });
  //   const votedLink = data.allLinks.find(link => link.id === linkId);

  //   votedLink.votes = createVote.link.votes;
  //   store.writeQuery({ query: ALL_LINKS_QUERY, data });
  // }

  // _subscribeToNewLinks = () => {
  //   this.props.allLinksQuery.subscribeToMore({
  //     document: gql`
  //       subscription {
  //         Link(filter: {
  //           mutation_in: [CREATED]
  //         }) {
  //           node {
  //             id
  //             url
  //             description
  //             createdAt
  //             postedBy {
  //               id
  //               name
  //             }
  //             votes {
  //               id
  //               user {
  //                 id
  //               }
  //             }
  //           }
  //         }
  //       }
  //     `,
  //     updateQuery: (previous, { subscriptionData }) => {
  //       const newAllLinks = [
  //         subscriptionData.data.Link.node,
  //         ...previous.allLinks
  //       ];

  //       return {
  //         ...previous,
  //         allLinks: newAllLinks
  //       };
  //     }
  //   });
  // }

  // _subscribeToNewVotes = () => {
  //   this.props.allLinksQuery.subscribeToMore({
  //     document: gql`
  //       subscription {
  //         Vote(filter: {
  //           mutation_in: [CREATED]
  //         }) {
  //           node {
  //             id
  //             link {
  //               id
  //               url
  //               description
  //               createdAt
  //               postedBy {
  //                 id
  //                 name
  //               }
  //               votes {
  //                 id
  //                 user {
  //                   id
  //                 }
  //               }
  //             }
  //             user {
  //               id
  //             }
  //           }
  //         }
  //       }
  //     `,
  //     updateQuery: (previous, { subscriptionData }) => {
  //       const votedLinkIndex = previous.allLinks.findIndex(
  //         link => link.id === subscriptionData.data.Vote.node.link.id
  //       );
  //       const link = subscriptionData.data.Vote.node.link;
  //       const newAllLinks = previous.allLinks.slice();

  //       newAllLinks[votedLinkIndex] = link;

  //       return {
  //         ...previous,
  //         allLinks: newAllLinks
  //       };
  //     }
  //   })
  // }

  _onLogin = () => {
    this.props.history.push('/login');
  }

  _onCreateNewLink = () => {
    this.props.history.push('/create');
  }

  _onLogout = () => {
    window.alert('!!! not implemented');
    // localStorage.removeItem(GC_USER_ID_KEY);
    // localStorage.removeItem(GC_AUTH_TOKEN_KEY);
    // this.forceUpdate(); // doesn't work as it should :(
  }

  _getLinksToRender = (isNewPage) => {
    const {
      // mode,
      allLinksQuery: {
        allLinks
      }
    } = this.props;

    // if (mode === 'top') {
    //   const rankedLinks = allLinks.slice();
    //   return rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
    // }

    return allLinks;
  }

  _nextPage = () => {
    window.alert('!!! not implemented');
    // const page = parseInt(this.props.match.params.page, 10);

    // if (page <= this.props.allLinksQuery._allLinksMeta.count / LINKS_PER_PAGE) {
    //   this.props.history.push(`/new/${ page + 1 }`);
    // }
  }

  _previousPage = () => {
    window.alert('!!! not implemented');
    // const page = parseInt(this.props.match.params.page, 10);

    // if (page > 1) {
    //   this.props.history.push(`/new/${ page - 1 }`);
    // }
  }

  render() {
    const {
      location,
      allLinksQuery: {
        loading,
        error
      }
    } = this.props;

    if (error) return <div>Error</div>;
    if (loading) return <div>loading...</div>;

    const isNewPage = location.pathname.includes('new');
    const linksToRender = this._getLinksToRender(isNewPage);
    const userId = null;
    // const userId = localStorage.getItem(GC_USER_ID_KEY);

    return (
      <div>
        { !userId ?
            <button onClick={this._onLogin}>Login</button> :
            <div>
              <button onClick={this._onCreateNewLink}>New Post</button>
              <button onClick={this._onLogout}>Logout</button>
            </div> }
        <div>
          { linksToRender.map((link, index) => (
              <Link key={link.id}
                    link={link}
                    index={index} />
            ))}
        </div>

        { isNewPage &&
            <div>
              <button onClick={this._previousPage}>Previous</button>
              <button onClick={this._nextPage}>Next</button>
            </div> }
      </div>
    );
  }
}

export const ALL_LINKS_QUERY = gql`
  query {
    allLinks {
      id
      url
      description
      created
      postedBy {
        id
        username
        email
      }
    }
  }
`
// export const ALL_LINKS_QUERY = gql`
//   query AllLinksQuery($first: Int, $skip: Int, $orderBy: LinkOrderBy) {
//     allLinks(first: $first, skip: $skip, orderBy: $orderBy) {
//       id
//       createdAt
//       url
//       description
//       postedBy {
//         id
//         name
//       }
//       votes {
//         id
//         user {
//           id
//         }
//       }
//     }
//     // _allLinksMeta {
//     //   count
//     // }
//   }
// `

export default graphql(ALL_LINKS_QUERY, {
  name: 'allLinksQuery',
  // options: (ownProps) => {
  //   const page = parseInt(ownProps.match.params.page, 10)
  //   const isNewPage = ownProps.location.pathname.includes('new')
  //   const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
  //   const first = isNewPage ? LINKS_PER_PAGE : 100
  //   const orderBy = isNewPage ? 'createdAt_DESC' : null
  //   return {
  //     variables: { first, skip, orderBy }
  //   }
  // }
}) (LinkList);
