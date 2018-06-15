import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, List, Switch } from 'antd';
import { setLight } from '../../redux/requests/hueRequests';

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

  componentWillMount() {
    if(this.props.hue.states){
      this.setState({ ...this.props.hue.states[this.props.light.id] });
    }
  }

  onSwitchChange = () => {
    let state = {...this.state};
    state.on = !state.on;
    setLight(this.props.config.bridgeIP, this.props.user.userToken, this.props.light.id, state);
    this.setState({ on: !this.state.on });
  }

  render() {
    return (
                <List.Item
                  actions={[<Switch checkedChildren="ON" unCheckedChildren="OFF" checked={this.state.on} onChange={() => this.onSwitchChange()}/>]}
                >
                  <List.Item.Meta
                    title={<Icon type="bulb" />}
                    description={this.props.light.name}
                  />
                </List.Item>
    );
  }
}

export default connect(mapStateToProps)(LightListItem);
