import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Col, Icon, Input, Modal, Radio, Row } from 'antd';

import Nav from '../../components/Nav/Nav';
import { USER_ACTIONS } from '../../redux/actions/userActions';
import { CONFIG_ACTIONS, saveConfig, updateLights, updateRoom } from '../../redux/actions/configActions';
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
      showRoomModal: false,
      selectedRoom: {},
      assignedLights: [],
      modifiedLights: [],
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
    }
  }

  componentDidMount() {
    this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
    this.props.dispatch({ type: CONFIG_ACTIONS.FETCH_LIGHTS });
    this.props.dispatch({ type: CONFIG_ACTIONS.FETCH_CONFIG });
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

  showRoomModal = room => {
    this.setState({
      assignedLights: [...this.props.hue.lights],
      selectedRoom: room,
      showRoomModal: true,
    });
  }

  roomModalSave = () => {
    console.log(this.state.modifiedLights);
    this.props.dispatch(updateLights(this.state.modifiedLights));
    this.props.dispatch(updateRoom(this.state.selectedRoom));
    this.setState({
      showRoomModal: false,
      selectedRoom: {},
    });
  }

  roomModalCancel = () => {
    this.setState({
      showRoomModal: false,
      selectedRoom: {},
      assignedLights: [],
    });
  }

  handleModalLightName = (index) => {
    let assignedLightsNew = this.state.assignedLights;
    let inputValue = this.refs[index].input.value;
    
    assignedLightsNew[index] = {
      ...this.state.assignedLights[index],
      name: inputValue,
    };
    this.setState({
      assignedLights: assignedLightsNew,
      modifiedLights: [...this.state.modifiedLights, assignedLightsNew[index]],
    });
  }


  handleLightChangeRoom = index => {
    let currentRoomId = this.state.assignedLights[index].room_id;
    let prevRoomId = this.props.hue.lights[index].room_id;
    let assignedLightsNew = this.state.assignedLights;
    let radioValue = this.refs.modalRoomId.props.value;

    if (currentRoomId !== radioValue) {
      console.log('SET TO NEW');
      assignedLightsNew[index] = {
        ...assignedLightsNew[index],
        room_id: radioValue,
      };
    } else if (currentRoomId === radioValue && prevRoomId === radioValue) {
      console.log('SET TO NULL');
      assignedLightsNew[index] = {
        ...assignedLightsNew[index],
        room_id: null,
      };
    } else {
      console.log('SET TO PREV');
      assignedLightsNew[index] = {
        ...assignedLightsNew[index],
        room_id: prevRoomId,
      };
    }
    this.setState({
      assignedLights: assignedLightsNew,
      modifiedLights:[...this.state.modifiedLights, assignedLightsNew[index]],
    });
  }

  addRoom = () => {
    this.setState({
      assignedLights: [...this.props.hue.lights],
      selectedRoom: {
        id: this.props.config.rooms.length + 1,
      },
      showRoomModal: true,
    });
  }

  render() {
    let content = null;

    if (this.props.user.userName) {
      content = (
        <div>
          <Row gutter={48} type="flex" justify="end">
            <Col span={4} justify="end">
              <Button
                type="primary"
                onClick={() => this.saveSettings()}
                size="large"
                style={{paddingLeft: 5}}
              >
                <Icon type="save" />
                Save
              </Button>
            </Col>
          </Row>
          <h3>Bridge:</h3>
          <Row gutter={24} type="flex" justify="start" style={{padding: 5}}>
          <Col span={5}>
          <Input
            placeholder="Bridge IP (ex: 192.168.1.100)"
            onChange={this.handleInputChangeFor('bridgeIP')}
            value={this.state.bridgeIP}
            style={{ width: 250 }}
            size="large"
          />
          </Col>
          <Col span={10}>
          <Search
            placeholder="Hue API Token"
            enterButton="Fetch New"
            onChange={this.handleInputChangeFor('userToken')}
            value={this.state.userToken}
            onSearch={() => this.getToken()}
            style={{ width: 500 }}
            size="large"
          />
          </Col>
          <Col span={4}>
          <Button
            type="primary"
            onClick={() => this.getLights()}
            size="large"
          >
            <Icon type="bulb" />
            Get Lights
          </Button>
          </Col>
          </Row>
          <h3>Manage Rooms:</h3>
          <Row gutter={24} type="flex" justify="start" style={{padding: 5}}>
            {this.props.config.rooms.map(room => 
            <Col span={3} key={room.id}>
              <Button 
                type="primary" 
                size="large" 
                onClick={() => this.showRoomModal(room)}
                style={{width: 140}}
              >
                {room.name}
              </Button>
            </Col>)}
            <Col span={3}>
              <Button type="primary" size="large" onClick={() => this.addRoom()}><Icon type="plus"/>Add Room</Button>
            </Col>
          </Row>
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
            {this.state.assignedLights.map((light, index) =>
              <Radio
                value={this.state.selectedRoom.id}
                key={light.id}
                checked={light.room_id === this.state.selectedRoom.id ? true : false}
                onClick={() => this.handleLightChangeRoom(index)}
                ref="modalRoomId"
              >
              {light.room_id === this.state.selectedRoom.id ? <Input placeholder="Light Name" onChange={() => this.handleModalLightName(index)} value={light.name} ref={index} style={{width: 175}}/> : <div>{light.name}</div>}
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