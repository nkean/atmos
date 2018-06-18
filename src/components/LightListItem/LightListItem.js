import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Switch } from 'antd';

import { setLight } from '../../redux/requests/hueRequests';
// import { fetchLightState } from '../../redux/actions/hueActions';

const mapStateToProps = state => ({
  user: state.user,
  config: state.config,
  hue: state.hue,
});

class LightListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      on: false,
    };
  }

  componentDidUpdate(prevProps) {
    if(this.props.hue.states !== prevProps.hue.states) {
      this.setState({ ...this.props.hue.states[this.props.light.id] });
    }
  }

  onSwitchChange = () => {
    let newState = this.state;
    newState.on = !newState.on;
    setLight(this.props.config.bridgeIP, this.props.user.userToken, this.props.light.id, newState);
    this.setState({...newState});
  //   this.props.dispatch(fetchLightState(this.props.config.bridgeIP, this.props.user.userToken, this.props.light.id));
  }

  render() {
    let listTitle = null;
    if(this.props.light.type === 'color') {
      listTitle = <img alt="light" src='./images/lights/e27_waca.svg' style={{ height: '30px' }} />;
    } else {
      listTitle = <img alt="light" src='./images/lights/e27_white.svg' style={{ height: '30px' }} />;
    }

    return (
                <List.Item
                  actions={[<Switch checkedChildren="ON" unCheckedChildren="OFF" checked={this.state.on} onChange={() => this.onSwitchChange()}/>]}
                >
                  <List.Item.Meta
                    title={listTitle}
                    description={this.props.light.name}
                  />
                </List.Item>
    );
  }
}

export default connect(mapStateToProps)(LightListItem);
