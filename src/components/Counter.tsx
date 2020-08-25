import React, { Component,createRef} from "react";
import { observer, inject } from "mobx-react";
import { Button,Input } from "antd";
import CountStore from "@/store/count";

@inject("countStore")
@observer
export default class Counter extends Component<{ countStore: CountStore }> {

  myRef = createRef<HTMLDivElement>();

  componentDidMount(){
    this.myRef.current?.focus()
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
        {/* <Input ref={this.myRef}></Input> */}

      </div>
    );
  }
}
