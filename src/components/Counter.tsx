import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Button } from "antd";

@inject("count")
@observer
export default class Header extends Component {
  constructor(props) {
      super(props)
  }
  render() {
    const {count} = this.props.count
    console.log(count);

    return (
      <div>
        <Button>-</Button>{count}<Button>+</Button>
      </div>
    );
  }
}
