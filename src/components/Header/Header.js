import React, { Component } from 'react';
import { connect } from 'react-redux';
import { triggerLogout } from '../../redux/actions/loginActions';
import { Button, Icon } from 'antd';

const mapStateToProps = state => ({
  user: state.user,
});

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
            {this.props.user.userName ? <Button onClick={this.logout} ghost>
              <Icon type="logout" />
              Logout
            </Button> : null}
          </span>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Header);
