import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Card, Collapse, List, Popover } from 'antd';
import LightListItem from '../LightListItem/LightListItem';
import { fetchAllStates } from '../../redux/actions/hueActions';
import { setLight } from '../../redux/requests/hueRequests';

const Panel = Collapse.Panel;
const ButtonGroup = Button.Group;

const mapStateToProps = state => ({
  user: state.user,
  config: state.config,
  hue: state.hue,
});

class RoomCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardActive: false,
      panelOpen: false,
      panelText: 'Show device list',
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.hue !== prevProps.hue && this.state.cardActive) {
      if (!this.props.hue.isLoading) {
        this.setState({
          panelOpen: true,
          panelText: 'Hide device list',
        });
      }
    }
  }

  onPanelChange = () => {
    if (this.state.panelOpen) {
      this.setState({
        cardActive: false,
        panelOpen: false,
        panelText: 'Show device list',
      });
    } else {
      this.setState({cardActive: true});
      this.props.dispatch(fetchAllStates(this.props.config.bridgeIP, this.props.user.userToken));
    }
  }

  onClickPopoverButton = (value) => {
    let lightState = {};
    if(value === 'OFF') {
      lightState = {
        on: false,
      };
    } else {
      lightState = {
        on: true,
        bri: value,
      };
    }
    this.props.group.forEach(light => {
      setLight(this.props.config.bridgeIP, this.props.user.userToken, light.id, lightState);
    });
  }

  render() {
    const popoverContent = (
      <ButtonGroup size="small">
        <Button type="danger" onClick={() => this.onClickPopoverButton('OFF')}>OFF</Button>
        <Button type="primary" onClick={() => this.onClickPopoverButton(64)}>25%</Button>
        <Button type="primary" onClick={() => this.onClickPopoverButton(127)}>50%</Button>
        <Button type="primary" onClick={() => this.onClickPopoverButton(191)}>75%</Button>
        <Button type="primary" onClick={() => this.onClickPopoverButton(254)}>100%</Button>
      </ButtonGroup>
    );
    
    const lightPopover = (
      <Popover placement="top" title="Set All Lights" content={popoverContent} trigger="hover">
        <Button shape="circle" size="small" type="primary" icon="ellipsis" />
      </Popover>
    );

    const roomImage = `./images/${this.props.roomImage}`;

    return (
      <Card
        cover={<img alt="house" src={roomImage} style={{width: 200, margin: 'auto', paddingTop: 10}}/>}
        title={this.props.roomName}
        extra={lightPopover}
        style={{backgroundColor: '#e6f7ff'}}
        className="room-card"
      >
        <Collapse onChange={() => this.onPanelChange()} style={{backgroundColor: '#ffffff'}}>
          <Panel
            header={this.state.panelText}
          >
            <List
              itemLayout="horizontal"
              dataSource={this.props.group}
              renderItem={light => <LightListItem key={light.id} light={light} />}
            />
          </Panel>
        </Collapse>
      </Card>
    );
  }
}

export default connect(mapStateToProps)(RoomCard);