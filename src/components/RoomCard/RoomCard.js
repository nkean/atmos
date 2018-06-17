import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Card, Collapse, Icon, List } from 'antd';
import LightListItem from '../LightListItem/LightListItem';
import { fetchAllStates } from '../../redux/actions/hueActions';

const Panel = Collapse.Panel;

const headerButtons = (
  <div>
  <Button shape="circle" icon="check" style={{backgroundColor: '#52c41a', color: '#ffffff'}}/>
  <Button shape="circle" icon="close" style={{backgroundColor: '#f5222d', color: '#ffffff'}}/>
  </div>
);

const mapStateToProps = state => ({
  user: state.user,
  config: state.config,
  hue: state.hue,
});

class RoomCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      panelOpen: false,
      panelText: 'Show device list',
    };
  }

  componentDidUpdate(prevProps) {
    if(this.props.hue !== prevProps.hue && this.state.panelOpen === false) {
      this.setState({
        panelOpen: true,
        panelText: 'Hide device list',
      });
    }
  }

  onPanelChange = () => {
    if (this.state.panelOpen) {
      this.setState({
        panelOpen: false,
        panelText: 'Show device list',
      });
    } else {
      this.props.dispatch(fetchAllStates(this.props.config.bridgeIP, this.props.user.userToken));
    }
  }

  render() {
    return (
      <Card
        cover={<img alt="house" src="https://image.flaticon.com/icons/png/512/18/18314.png" />}
        title={this.props.roomName}
        extra={headerButtons}
      >
        <Collapse onChange={() => this.onPanelChange()}>
          <Panel
            header={this.state.panelText}
            ref={this.props.roomName}
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