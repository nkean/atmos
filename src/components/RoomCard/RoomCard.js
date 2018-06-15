import React, { Component } from 'react';
import { Button, Card, Collapse, Dropdown, Icon, List, Menu } from 'antd';
import LightListItem from '../LightListItem/LightListItem';

const MenuItem = Menu.Item;
const Panel = Collapse.Panel;

const buttonMenu = (
  <Dropdown overlay={
    <Menu onClick={() => this.onButtonClick()}>
      <MenuItem key="true">All On</MenuItem>
      <MenuItem key="false">All Off</MenuItem>
    </Menu>
  }>
    <Button>
      Lights<Icon type="down" />
    </Button>
  </Dropdown>
);

class RoomCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      panelOpen: false,
      panelText: 'Show device list',
    };
  }

  onPanelChange = () => {
    if (this.state.panelOpen) {
      this.setState({
        panelOpen: false,
        panelText: 'Show device list',
      });
    } else {
      this.setState({
        panelOpen: true,
        panelText: 'Hide device list',
      });
    }
  }

  onButtonClick = value => {

  }

  render() {
    return (
      <Card
        cover={<img alt="house" src="https://image.flaticon.com/icons/png/512/18/18314.png" />}
        title={this.props.roomName}
        extra={buttonMenu}
      >
        <Collapse bordered={false} onChange={() => this.onPanelChange()}>
          <Panel
            header={this.state.panelText}
          >
            <List
              itemLayout="horizontal"
              dataSource={this.props.group}
              renderItem={light => <LightListItem key={light.id} light={light}/>}
            />
          </Panel>
        </Collapse>
      </Card>
    );
  }
}

export default RoomCard;