import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Button, Icon, Input } from 'antd';

import Nav from '../../components/Nav/Nav';
import { USER_ACTIONS } from '../../redux/actions/userActions';

const Search = Input.Search;

const mapStateToProps = state => ({
  user: state.user,
});

class SettingsPage extends Component {
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

  handleInputChangeFor = propertyName => event => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  fetchToken = (userName) => {
    const url = `http://${this.state.bridgeIP}/api`;
    const config = {"devicetype": `atmos#${userName}`};
    if(this.state.apiToken === ''){
    axios.post(url, config)
      .then(response => {
        this.setState({
          apiToken: response.data[0].success.username,
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
    const data = this.state;
    axios.post('/api/settings/save', data)
      .then(response => {
        console.log(`Successfully saved user settings for ${this.props.user.userName}`);
      })
      .catch(error => {
        alert('There was an error saving settings: ', error);
      })

  }

  getSettings = () => {
    axios.get('/api/settings/fetch')
      .then(response => {
        this.setState({
          apiToken: response.data.token,
          bridgeIP: response.data.bridge,
        });
      })
      .catch(error => {
        console.log('Error fetching user settings: ', error);
      })
  }

  getLights = () => {
    const url = `http://${this.state.bridgeIP}/api/${this.state.apiToken}/lights`;
    axios.get(url)
      .then(response => {
        let lights = response.data;
        let allLights = [];
        for(const key of Object.keys(lights)) {
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
        this.sendLights();
      })
      .catch(error => {
        console.log('Error with GET to Hue bridge: ', error);
      })
  }

  sendLights = () => {
    const data = this.state.lights;
    axios.post('/api/settings/light', data)
      .then(response => {
        console.log('Lights saved to database');
      })
      .catch(error => {
        console.log('Error with POST to database: ', error);
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
            style={{width: 200}}
          />
          <Search 
            placeholder="Hue API Token"
            enterButton="Fetch New"
            onChange={this.handleInputChangeFor('apiToken')}
            value={this.state.apiToken}
            onSearch={() => this.fetchToken(this.props.user.userName)}
            style={{width: 500}}
          />
          <Button
            type="primary"
            onClick={() => this.saveSettings()}
          >
            <Icon type="save"/>
            Save
          </Button>
          <Button
            type="primary"
            onClick={() => this.getLights()}
          >
            <Icon type="bulb"/>
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