import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Input } from 'antd';

import Nav from '../../components/Nav/Nav';
import { USER_ACTIONS } from '../../redux/actions/userActions';
import { CONFIG_ACTIONS, saveConfig } from '../../redux/actions/configActions';
import { fetchLights, fetchToken } from '../../redux/actions/hueActions';

const Search = Input.Search;

const mapStateToProps = state => ({
  user: state.user,
  config: state.config,
  hue: state.hue,
});

class SettingsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userToken: '',
      bridgeIP: '',
      lights: [],
    };
  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.user.userToken !== this.state.userToken) {
        this.setState({
          userToken: nextProps.user.userToken,
        });
      } else if (nextProps.config.bridgeIP !== this.state.bridgeIP) {
        this.setState({
          bridgeIP: nextProps.config.bridgeIP,
        });
      } else if (nextProps.hue.lights !== this.state.lights) {
        this.setState({
          lights: nextProps.hue.lights,
        });
      }
  }

  componentDidMount() {
    this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
    this.props.dispatch({ type: CONFIG_ACTIONS.FETCH_CONFIG });
    this.props.dispatch({ type: CONFIG_ACTIONS.FETCH_LIGHTS });
  }

  componentDidUpdate() {
    if (!this.props.user.isLoading && this.props.user.userName === null) {
      this.props.history.push('home');
    }
  }

  handleInputChangeFor = propertyName => event => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  getToken = () => {
    if (this.state.userToken === null) {
      this.props.dispatch(fetchToken(this.state.bridgeIP, this.props.user.userName));
    } else {
      alert('A token already exists for this username');
    }
  }

  saveSettings = () => {
    this.props.dispatch(saveConfig(this.state.bridgeIP, this.state.userToken));
  }

  getLights = () => {
    this.props.dispatch(fetchLights(this.state.bridgeIP, this.state.userToken));
  }

  render() {
    let content = null;

    if (this.props.user.userName) {
      content = (
        <div>
          <Input
            placeholder="Bridge IP (ex: 192.168.1.100)"
            onChange={this.handleInputChangeFor('bridgeIP')}
            value={this.state.bridgeIP}
            style={{ width: 250 }}
          />
          <Search
            placeholder="Hue API Token"
            enterButton="Fetch New"
            onChange={this.handleInputChangeFor('userToken')}
            value={this.state.userToken}
            onSearch={() => this.getToken()}
            style={{ width: 500 }}
          />
          <Button
            type="primary"
            onClick={() => this.saveSettings()}
          >
            <Icon type="save" />
            Save
          </Button>
          <Button
            type="primary"
            onClick={() => this.getLights()}
          >
            <Icon type="bulb" />
            Get Lights
          </Button>
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
export default connect(mapStateToProps)(SettingsPage);