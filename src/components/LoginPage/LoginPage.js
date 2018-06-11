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
      this.props.history.push('/user');
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
      <div>
        {this.renderAlert()}
        <Form onSubmit={this.login}>
          <FormItem>
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
                onChange={this.handleInputChangeFor('username')}
              />
          </FormItem>
          <FormItem>
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Password"
                onChange={this.handleInputChangeFor('password')}
              />
          </FormItem>
          <Button
            type="primary"
            htmlType="submit"
          >
            Log In
          </Button>
          Or <Link to="/register">Register</Link>
        </Form>
      </div>
    );
  }
}

export default connect(mapStateToProps)(LoginPage);
