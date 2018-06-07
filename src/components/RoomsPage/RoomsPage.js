import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import LightCard from '../LightCard/LightCard';
import Nav from '../../components/Nav/Nav';
import { USER_ACTIONS } from '../../redux/actions/userActions';

const mapStateToProps = state => ({
  user: state.user,
});

class RoomsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiToken: '',
      bridgeIP: '',
      lights: [],
    };
  }

  componentDidMount() {
    this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
    this.getSettings();
  }

  componentDidUpdate() {
    if (!this.props.user.isLoading && this.props.user.userName === null) {
      this.props.history.push('home');
    }
  }

  getLights() {
    axios.get('/api/settings/light')
      .then(response => {
        this.setState({
          lights: response.data,
        });
      })
      .catch(error => {
        console.log('Error with GET: ', error);
      })
  }

  getSettings = () => {
    axios.get('/api/settings/fetch')
      .then(response => {
        this.setState({
          apiToken: response.data.token,
          bridgeIP: response.data.bridge,
        });
        this.getLights();
      })
      .catch(error => {
        console.log('Error fetching user settings: ', error);
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
                                              apiToken={this.state.apiToken} 
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