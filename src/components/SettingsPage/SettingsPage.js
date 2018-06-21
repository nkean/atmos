import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Badge, Button, Col, Icon, Input, Modal, Radio, Row, Select } from 'antd';

import Nav from '../../components/Nav/Nav';
import { USER_ACTIONS } from '../../redux/actions/userActions';
import { CONFIG_ACTIONS, saveConfig, updateLights, updateRoom } from '../../redux/actions/configActions';
import { fetchLights, fetchToken } from '../../redux/actions/hueActions';

const Option = Select.Option;
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

  componentDidUpdate(prevProps) {
    if (!this.props.user.isLoading && this.props.user.userName === null) {
      this.props.history.push('home');
    } else if (prevProps.user.userToken !== this.props.user.userToken) {
      this.setState({
        userToken: this.props.user.userToken,
      });
    } else if (prevProps.config.bridgeIP !== this.props.config.bridgeIP) {
      this.setState({
        bridgeIP: this.props.config.bridgeIP,
      });
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
    if (window.confirm('Please press the link button on your bridge, then press OK to get new API token.')) {
      console.log('Pressed OK')
      this.props.dispatch(fetchToken(this.state.bridgeIP, this.props.user.userName));
    }
  }

  saveSettings = () => {
    this.props.dispatch(saveConfig(this.state.bridgeIP, this.state.userToken));
  }

  getLights = () => {
    if (this.props.user.userToken) {
      this.props.dispatch(fetchLights(this.state.bridgeIP, this.state.userToken));
      if (window.confirm('Sucessfully updated available lights')) {
        this.props.dispatch({ type: CONFIG_ACTIONS.FETCH_ROOMS });
        this.props.dispatch({ type: CONFIG_ACTIONS.FETCH_LIGHTS });
      }
    } else {
      alert('You don\'t have an API token. Please use the "Fetch New" button to get one, then try again');
    }
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
    let modifiedLights = [];
    this.state.assignedLights.forEach(light => {
      if (light.room_id === this.state.selectedRoom.id) {
        modifiedLights.push(light);
      }
    });
    this.props.dispatch(updateLights(modifiedLights));
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
    });
  }

  handleModalRoomImage = (value) => {
    this.setState({
      selectedRoom: {
        ...this.state.selectedRoom,
        image: value,
      },
    });
  }

  handleLightChangeRoom = index => {
    let currentRoomId = this.state.assignedLights[index].room_id;
    let prevRoomId = this.props.hue.lights[index].room_id;
    let assignedLightsNew = this.state.assignedLights;
    let radioValue = this.refs.modalRoomId.props.value;

    if (currentRoomId !== radioValue) {
      assignedLightsNew[index] = {
        ...assignedLightsNew[index],
        room_id: radioValue,
      };
    } else if (currentRoomId === radioValue && prevRoomId === radioValue) {
      assignedLightsNew[index] = {
        ...assignedLightsNew[index],
        room_id: null,
      };
    } else {
      assignedLightsNew[index] = {
        ...assignedLightsNew[index],
        room_id: prevRoomId,
      };
    }
    this.setState({
      assignedLights: assignedLightsNew,
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
        <div style={{ paddingTop: '20px' }}>
          <Row gutter={48} style={{ paddingLeft: 40, paddingRight: 40 }}>
            <Col span={14} style={{ backgroundColor: '#fafafa', border: '1.5px #bfbfbf solid', borderRadius: '15px', margin: 5 }}>
              <Row style={{ paddingBottom: 20 }}>
                <h3>Bridge IP:</h3>
                <Input
                  placeholder="Bridge IP (ex: 192.168.1.100)"
                  onChange={this.handleInputChangeFor('bridgeIP')}
                  value={this.state.bridgeIP}
                  size="large"
                  style={{ maxWidth: 300 }}
                />
              </Row>

              <Row style={{ paddingBottom: 20 }}>
                <h3>API Token:</h3>
                <Search
                  placeholder="Hue API Token"
                  enterButton="Fetch New"
                  onChange={this.handleInputChangeFor('userToken')}
                  value={this.state.userToken}
                  onSearch={() => this.getToken()}
                  size="large"
                />
              </Row>

              <Row style={{ paddingBottom: 20 }}>
                <h3>Update Light List:</h3>
                <Button
                  type="primary"
                  onClick={() => this.getLights()}
                  size="large"
                >
                  <Icon type="bulb" />
                  Get Lights
                </Button>
              </Row>
            </Col>

            <Col span={8} style={{ backgroundColor: '#fafafa', border: '1.5px #bfbfbf solid', borderRadius: '15px', margin: 5 }}>
              <h3>Manage Rooms:</h3>
              <Row gutter={32} type="flex">
                {this.props.config.rooms.map(room =>
                  <Col key={room.id} style={{ paddingBottom: 20 }}>
                    <Badge count={`${room.count} lights`}>
                      <Button
                        type="primary"
                        size="large"
                        onClick={() => this.showRoomModal(room)}
                        style={{ width: 140 }}
                      >
                        {room.name}
                      </Button>
                    </Badge>
                  </Col>)
                }
                <Col style={{ paddingBottom: 20 }}>
                  <Button type="primary" size="large" onClick={() => this.addRoom()} style={{ width: 140 }}><Icon type="plus" />Add Room</Button>
                </Col>
              </Row>
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
            <Row gutter={24} type="flex" justify="center" style={{ paddingBottom: 15 }}>
              <Col span={12}>
                <h4>Room Name:</h4>
                <Input
                  placeholder="Room Name"
                  onChange={() => this.handleModalRoomName()}
                  value={this.state.selectedRoom.name}
                  ref="modalRoomName"
                  style={{ width: 200 }}
                />
              </Col>
              <Col span={12}>
                <h4>Room Image:</h4>
                <Select value={this.state.selectedRoom.image} onChange={this.handleModalRoomImage} style={{ width: 125 }}>
                  <Option value="bathroom.svg">Bathroom</Option>
                  <Option value="bedroom.svg">Bedroom</Option>
                  <Option value="dining.svg">Dining</Option>
                  <Option value="frontdoor.svg">Frontdoor</Option>
                  <Option value="gym.svg">Gym</Option>
                  <Option value="hallway.svg">Hallway</Option>
                  <Option value="house.svg">House</Option>
                  <Option value="kitchen.svg">Kitchen</Option>
                  <Option value="living.svg">Living</Option>
                  <Option value="office.svg">Office</Option>
                  <Option value="other.svg">Other</Option>
                  <Option value="recreation.svg">Recreation</Option>
                  <Option value="toilet.svg">Toilet</Option>
                </Select>
              </Col>
            </Row>
            <Row type="flex" justify="space-around">
              <Col span={24}>
                <h4>Lights:</h4>
              </Col>
              {this.state.assignedLights.map((light, index) =>
                <Col span={12} key={light.id} >
                  <Radio
                    value={this.state.selectedRoom.id}
                    checked={light.room_id === this.state.selectedRoom.id ? true : false}
                    onClick={() => this.handleLightChangeRoom(index)}
                    ref="modalRoomId"
                    style={{ paddingTop: 10, paddingBottom: 10 }}
                  >
                    {light.room_id === this.state.selectedRoom.id ? <Input placeholder="Light Name" size="small" onChange={() => this.handleModalLightName(index)} value={light.name} ref={index} style={{ width: 150 }} /> : <span>{light.name}</span>}
                  </Radio>
                </Col>)
              }
            </Row>
          </Modal>
          <Row gutter={48} type="flex" justify="end" style={{ paddingRight: 50, paddingTop: 20 }}>
            <Col span={4} justify="end">
              <Button
                type="primary"
                onClick={() => this.saveSettings()}
                size="large"
              >
                <Icon type="save" />
                Save
              </Button>
            </Col>
          </Row>
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