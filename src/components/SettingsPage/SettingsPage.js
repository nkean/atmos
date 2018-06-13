import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Input, Modal, Radio } from 'antd';

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
      rooms: [],
      showRoomModal: false,
      selectedRoom: {},
      assignedLights: [],
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
    } else if (nextProps.config.rooms !== this.state.rooms) {
      this.setState({
        rooms: nextProps.config.rooms,
      });
    }
  }

  componentDidMount() {
    this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
    this.props.dispatch({ type: CONFIG_ACTIONS.FETCH_CONFIG });
    this.props.dispatch({ type: CONFIG_ACTIONS.FETCH_LIGHTS });
    this.props.dispatch({ type: CONFIG_ACTIONS.FETCH_ROOMS });
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

  handleModalRoomName = () => {
    this.setState({
      selectedRoom: {
        ...this.state.selectedRoom,
        name: this.refs.modalRoomName.input.value,
      },
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

  showRoomModal = (room) => {
    this.setState({
      selectedRoom: room,
      showRoomModal: true,
    });
  }

  roomModalSave = () => {
    this.setState({
      showRoomModal: false,
    });
  }

  roomModalCancel = () => {
    this.setState({
      showRoomModal: false,
      selectedRoom: {},
      assignedLights: [],
    });
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
          <div>
            {this.state.rooms.map(room => <Button type="primary" onClick={() => this.showRoomModal(room)} key={room.id}>{room.name}</Button>)}
          </div>
          <Modal
            title="Configure Room Settings"
            okText="Save"
            cancelText="Cancel"
            visible={this.state.showRoomModal}
            onOk={this.roomModalSave}
            onCancel={this.roomModalCancel}
          >
            <Input
              placeholder="Room Name"
              onChange={() => this.handleModalRoomName()}
              value={this.state.selectedRoom.name}
              ref="modalRoomName"
            />
            {this.state.lights.map(light =>
              <Radio
                value={this.state.selectedRoom.id}
                key={light.id}
                checked={light.room_id === this.state.selectedRoom.id ? true : false}
              >
                {light.name}
              </Radio>)
            }
          </Modal>
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