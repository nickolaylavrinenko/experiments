import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

class Header extends Component {
  static displayName = 'Header'

  _logout = () => {
    alert('!!! not implemented');
    // this.props.history.push(`/`);
  }

  render() {
    const userId = null;

    return (
      <div className='flex pa1 justify-between nowrap orange'>
        <div className='flex flex-fixed black'>
          <div className='fw7 mr1'>Hacker News</div>
          <Link to='/' className='ml1 no-underline black'>new</Link>
          { /* <div className='ml1'>|</div> */ }
          { /* <Link to='/search' className='ml1 no-underline black'>search</Link> */ }
          { /* userId && (
              <div className='flex'>
                <div className='ml1'>|</div>
                <Link to='/create' className='ml1 no-underline black'>submit</Link>
              </div>
            ) */ }
        </div>
        <div className='flex flex-fixed'>
          { userId ?
              <div className='ml1 pointer black' onClick={this._logout}>logout</div> :
              <Link className='ml1 no-underline black' to='/login'>login</Link> }
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
