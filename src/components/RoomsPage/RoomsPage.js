import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import Nav from '../../components/Nav/Nav';
import { USER_ACTIONS } from '../../redux/actions/userActions';

const mapStateToProps = state => ({
  user: state.user,
});

const hueToken = process.env.REACT_APP_HUE_BRIDGE_TOKEN;
const bridgeIP = process.env.REACT_APP_LOCAL_HUE_IP;

class RoomsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lights: {},
    };
  }

  componentDidMount() {
    this.props.dispatch({type: USER_ACTIONS.FETCH_USER});
  }

  componentDidUpdate() {
    if (!this.props.user.isLoading && this.props.user.userName === null) {
      this.props.history.push('home');
    }
  }

  getLights() {
    const url = `http://${bridgeIP}/api/${hueToken}/lights`;
    axios.get(url)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log('Error with GET to Hue bridge: ', error);
      })
  }

  render() {
    let content = null;

    if (this.props.user.userName) {
      this.getLights();
      content = (
        <div>
          <p>
            Info Page
          </p>
        </div>
      );
    }

    return (
      <div>
        <Nav />
        { content }
      </div>
    );
  }
}

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(RoomsPage);