import React, { Component } from 'react';
import { connect } from 'react-redux';

import Nav from '../../components/Nav/Nav';
import { USER_ACTIONS } from '../../redux/actions/userActions';
import { CONFIG_ACTIONS } from '../../redux/actions/configActions';
 
const mapStateToProps = state => ({
  user: state.user,
  config: state.config,
  hue: state.hue,
});

class RoomsPage extends Component {
  
  componentDidMount() {
    this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
    this.props.dispatch({ type: CONFIG_ACTIONS.FETCH_CONFIG });
    this.props.dispatch({ type: CONFIG_ACTIONS.FETCH_GROUPS });
    this.props.dispatch({ type: CONFIG_ACTIONS.FETCH_LIGHTS });
    this.props.dispatch({ type: CONFIG_ACTIONS.FETCH_ROOMS });
  }

  componentDidUpdate() {
    if (!this.props.user.isLoading && this.props.user.userName === null) {
      this.props.history.push('home');
    }
  }

  render() {
    let content = null;

    if (this.props.user.userName) {
      content = (
        <div>
          
        </div>
      );
    }

    return (
      <div>
        <Nav />
        {content}
      </div>
    );
  }
}

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(RoomsPage);
