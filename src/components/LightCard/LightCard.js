import React, { Component } from 'react';
import axios from 'axios';
import { Card } from 'antd';

const { Meta } = Card;

class LightCard extends Component {

  lightOn = () => {
    console.log('light on');
    const url = `http://${this.props.bridgeIP}/api/${this.props.apiToken}/lights/${this.props.light.id}/state`;
    axios.put(url, {"on": true})
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      })
  }

  lightOff = () => {
    console.log('light off');
    const url = `http://${this.props.bridgeIP}/api/${this.props.apiToken}/lights/${this.props.light.id}/state`;
    axios.put(url, {"on": false})
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      })
  }

  render() {
    return (
      <div>
        <Card
          style={{width: 250}}
          actions={[<span onClick={() => this.lightOn()}>ON</span>, <span onClick={() => this.lightOff()}>OFF</span>]}
        >
          <Meta
            title={this.props.light.name}
            description={this.props.light.type}
          />
        </Card>
      </div>
    );
  }
}

// this allows us to use <App /> in index.js
export default LightCard;