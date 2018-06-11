import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import LightCard from '../LightCard/LightCard';
import Nav from '../../components/Nav/Nav';
import { USER_ACTIONS } from '../../redux/actions/userActions';
import { CONFIG_ACTIONS } from '../../redux/actions/configActions';

const mapStateToProps = state => ({
  user: state.user,
  config: state.config,
});

class RoomsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userToken: '',
      bridgeIP: '',
      lights: [],
    };
  }

  componentWillReceiveProps() {
    this.setState({
      userToken: this.props.user.userToken,
      bridgeIP: this.props.config.bridgeIP,
    });
    this.getLights();
  }

  componentDidMount() {
    this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
    this.props.dispatch({ type: CONFIG_ACTIONS.FETCH_CONFIG });
  }

  componentDidUpdate() {
    if (!this.props.user.isLoading && this.props.user.userName === null) {
      this.props.history.push('home');
    }
  }

  getLights() {
    axios.get('/api/config/light')
      .then(response => {
        this.setState({
          lights: response.data,
        });
      })
      .catch(error => {
        console.log('Error with GET: ', error);
      })
  }

  render() {
    let content = null;

    if (this.props.user.userName) {
      content = (
        <div>
          {this.state.lights.map(light => <LightCard
            key={light.id}
            light={light}
            apiToken={this.state.userToken}
            bridgeIP={this.state.bridgeIP}
          />)}
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