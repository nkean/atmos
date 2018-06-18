import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Icon, Input } from 'antd';

const FormItem = Form.Item;

class RegisterPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      message: '',
    };
  }

  registerUser = (event) => {
    event.preventDefault();

    if (this.state.username === '' || this.state.password === '') {
      this.setState({
        message: 'Choose a username and password!',
      });
    } else {
      const body = {
        username: this.state.username,
        password: this.state.password,
      };

      // making the request to the server to post the new user's registration
      axios.post('/api/user/register/', body)
        .then((response) => {
          if (response.status === 201) {
            this.props.history.push('/home');
          } else {
            this.setState({
              message: 'Ooops! That didn\'t work. The username might already be taken. Try again!',
            });
          }
        })
        .catch(() => {
          this.setState({
            message: 'Ooops! Something went wrong! Is the server running?',
          });
        });
    }
  } // end registerUser

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  renderAlert() {
    if (this.state.message !== '') {
      return (
        <h2
          className="alert"
          role="alert"
        >
          {this.state.message}
        </h2>
      );
    }
    return (<span />);
  }

  render() {
    return (
      <div className="sign-form">
        {this.renderAlert()}
        <Form onSubmit={this.registerUser}>
          <h2 style={{ textAlign: 'center', paddingTop: '20px' }}>Register User</h2>
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
              Register
            </Button>
          </div>
          <div style={{ paddingLeft: '126px' }}>
            Or <Link to="/home">Cancel</Link>
          </div>
        </Form>
      </div>
    );
  }
}

export default RegisterPage;

