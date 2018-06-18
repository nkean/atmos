import React, { Component } from 'react';
import { connect } from 'react-redux';
import { triggerLogout } from '../../redux/actions/loginActions';
import { Button, Icon } from 'antd';

class Header extends Component {

  logout = () => {
    this.props.dispatch(triggerLogout());
  }

  render() {
    return (
      <div className="instructions">
        <div className="header-title">
          {this.props.title}<span className="header-tagline">{this.props.tagline}</span>
          <span style={{ float: 'right', paddingRight: '15px' }}>
            <Button size="small" onClick={this.logout} ghost>
              <Icon type="logout" />
              Logout
            </Button>
          </span>
        </div>
      </div>
    );
  }
}

export default connect()(Header);
