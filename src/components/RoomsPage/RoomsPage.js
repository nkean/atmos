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

  componentDidMount() {
    this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
    this.props.dispatch({ type: CONFIG_ACTIONS.FETCH_CONFIG });
    this.props.dispatch({ type: CONFIG_ACTIONS.FETCH_GROUPS });
  }

  componentDidUpdate() {
    if (!this.props.user.isLoading && this.props.user.userName === null) {
      this.props.history.push('home');
    } else if (this.props.config.bridgeIP !== null && this.props.user.userToken !== null) {
      if(this.props.hue.states === null && !this.props.hue.isLoading) {
        this.props.dispatch(fetchStates(this.props.config.bridgeIP, this.props.user.userToken));
      }
    }
  }

  render() {
    let content = null;

    if (this.props.user.userName) {
      content = (
        <div>
          <Row gutter={24} type="flex" justify="start" style={{ margin: 5, maxWidth: 1100 }}>
            {this.props.config.groups.lights.map((group, index) => (
              <Col span={6} key={index}>
                <RoomCard
                  group={group}
                  roomName={this.props.config.groups.names[index]}
                />
              </Col>
            ))}
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
