import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Button, Card, Icon } from 'antd';

import LightCard from '../LightCard/LightCard';
import Nav from '../../components/Nav/Nav';
import { USER_ACTIONS } from '../../redux/actions/userActions';

const mapStateToProps = state => ({
  user: state.user,
});

const hueToken = '78bc7d002bc743a6603993b6f96137f';
const bridgeIP = '192.168.1.101';

class RoomsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lights: [],
    };
  }

  componentDidMount() {
    this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
  }

  componentDidUpdate() {
    if (!this.props.user.isLoading && this.props.user.userName === null) {
      this.props.history.push('home');
    }
  }

  getLights() {
    const url = `http://${bridgeIP}/api/${hueToken}/lights`;
    axios.get(url)
      .then(response => {
        let lightList = [];
        for (const key of Object.keys(response.data)) {
          lightList.push(key);
        }
        this.setState({
          lights: lightList,
        });
      })
      .catch(error => {
        console.log('Error with GET to Hue bridge: ', error);
      })
  }

  render() {
    let content = null;

    if (this.props.user.userName) {
      content = (
        <div>
          <Button
            type="primary"
            onClick={() => this.getLights()}
          >
            Get Lights
          </Button>
          <div>
            {this.state.lights.map(light => <LightCard
                                              key={light}
                                              light={light}
                                              hueToken={hueToken} 
                                              bridgeIP={bridgeIP}
                                              />)}
          </div>
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