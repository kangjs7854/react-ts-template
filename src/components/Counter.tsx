import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Button } from "antd";

@inject("countStore")
@observer
export default class Counter extends Component {
  constructor(props) {
    super(props);
  }

  handleIncrease = () => {
    this.props.countStore.increase();
  };

  handleDecrease = () => {
    this.props.countStore.decrease();
  };
  render() {
    const { count } = this.props.countStore;

    return (
      <div>
        <Button onClick={() => this.handleDecrease()}>-</Button>
        {count}
        <Button onClick={this.handleIncrease}>+</Button>
      </div>
    );
  }
}
