import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Button, Icon, Input } from 'antd';

import Nav from '../../components/Nav/Nav';
import { USER_ACTIONS } from '../../redux/actions/userActions';
import { CONFIG_ACTIONS, saveConfig, updateLights } from '../../redux/actions/configActions';

const Search = Input.Search;

const mapStateToProps = state => ({
  user: state.user,
  config: state.config,
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

  componentWillReceiveProps() {
      this.setState({
        userToken: this.props.user.userToken,
        bridgeIP: this.props.config.bridgeIP,
      });
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

  handleInputChangeFor = propertyName => event => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  fetchToken = (userName) => {
    const url = `http://${this.state.bridgeIP}/api`;
    const config = { "devicetype": `atmos#${userName}` };
    if (this.state.userToken === null) {
      axios.post(url, config)
        .then(response => {
          this.setState({
            userToken: response.data[0].success.username,
          });
        })
        .catch(error => {
          console.log('Error getting API Token: ', error);
        })
    } else {
      alert('Token already exists for this username');
    }
  }

  saveSettings = () => {
    this.props.dispatch(saveConfig(this.state.bridgeIP, this.state.userToken));
  }

  saveLights = () => {
    this.props.dispatch(updateLights(this.state.lights));
  }

  getLights = () => {
    const url = `http://${this.state.bridgeIP}/api/${this.state.userToken}/lights`;
    axios.get(url)
      .then(response => {
        let lights = response.data;
        let allLights = [];
        for (const key of Object.keys(lights)) {
          const newLight = {
            id: key,
            type: lights[key].type,
            name: lights[key].name,
          };
          allLights.push(newLight);
        }
        this.setState({
          lights: allLights,
        });
        this.saveLights();
      })
      .catch(error => {
        console.log('Error with GET to Hue bridge: ', error);
      })
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
            onSearch={() => this.fetchToken(this.props.user.userName)}
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