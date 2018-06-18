import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Form, Icon, Input } from 'antd';

import { triggerLogin, formError, clearError } from '../../redux/actions/loginActions';

const FormItem = Form.Item;

const mapStateToProps = state => ({
  user: state.user,
  login: state.login,
});

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  componentDidMount() {
    this.props.dispatch(clearError());
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.user.userName) {
      this.props.history.push('/rooms');
    }
  }

  login = event => {
    event.preventDefault();

    if (this.state.username === '' || this.state.password === '') {
      this.props.dispatch(formError());
    } else {
      this.props.dispatch(triggerLogin(this.state.username, this.state.password));
    }
  }

  goToRegister = () => {
    this.props.history.push('/register');
  }

  handleInputChangeFor = propertyName => event => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  renderAlert() {
    if (this.props.login.message !== '') {
      return (
        <h2
          className="alert"
          role="alert"
        >
          {this.props.login.message}
        </h2>
      );
    }
    return (<span />);
  }

  render() {
    return (
      <div className="sign-form">
        {this.renderAlert()}
        <Form onSubmit={this.login}>
          <h2 style={{ textAlign: 'center', paddingTop: '20px' }}>Please Login</h2>
          <FormItem>
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)', paddingLeft: '40px' }} />}
              placeholder="Username"
              value={this.state.username}
              onChange={this.handleInputChangeFor('username')}
              style={{ width: '280px', paddingLeft: '40px' }}
            />
          </FormItem>
          <FormItem>
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)', paddingLeft: '40px' }} />}
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handleInputChangeFor('password')}
              style={{ width: '280px', paddingLeft: '40px' }}
            />
          </FormItem>
          <div style={{ paddingLeft: '40px' }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '240px' }}
            >
              <Icon type="login"/>
              Log In
            </Button>
          </div>
          <div style={{ paddingLeft: '122px' }}>
            Or <Link to="/register">Register</Link>
          </div>
        </Form>
      </div>
    );
  }
}

export default connect(mapStateToProps)(LoginPage);
