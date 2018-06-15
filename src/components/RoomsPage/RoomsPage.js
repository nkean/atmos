import React, { Component } from 'react';
import { connect } from 'react-redux';
import Nav from '../Nav/Nav';
import { USER_ACTIONS } from '../../redux/actions/userActions';
import { CONFIG_ACTIONS } from '../../redux/actions/configActions';
import { fetchStates } from '../../redux/actions/hueActions';
import { Col, Row } from 'antd';

import RoomCard from '../RoomCard/RoomCard';

const mapStateToProps = state => ({
  user: state.user,
  config: state.config,
  hue: state.hue,
});

class RoomsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userToken: '',
      bridgeIP: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.userToken !== this.state.userToken) {
      console.log('Set userToken');
      this.setState({
        userToken: nextProps.user.userToken,
      });
    } else if (nextProps.config.bridgeIP !== this.state.bridgeIP) {
      console.log('Set bridgeIP');
      this.setState({
        bridgeIP: nextProps.config.bridgeIP,
      });
    }
  }

  componentDidMount() {
    this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
    this.props.dispatch({ type: CONFIG_ACTIONS.FETCH_CONFIG });
    this.props.dispatch({ type: CONFIG_ACTIONS.FETCH_GROUPS });
  }

  componentDidUpdate() {
    if (!this.props.user.isLoading && this.props.user.userName === null) {
      this.props.history.push('home');
    }
  }

  render() {
    let content = null;

    if (this.props.user.userName) {
      content = (
        <div>
          <Row gutter={24} type="flex" justify="start" style={{paddingLeft:16}}>
          {this.props.config.groups.lights.map((group, index)=> <Col span={6} key={index}>
                                                                  <RoomCard
                                                                    group={group}
                                                                    roomName={this.props.config.groups.names[index]}
                                                                  />
                                                                </Col>)}
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
export default connect(mapStateToProps)(RoomsPage);
