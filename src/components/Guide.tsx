import Joyride, {ACTIONS, EVENTS, STATUS} from "react-joyride";
import React from "react";

export default class Guide extends React.Component<any, any>{
    state = {
        stepIndex:0,
        run: false,
        steps: [
            {
                disableBeacon:true,
                target: '.my-first-step',
                content: '输入api名称!',
            },
            {
                target: '.my-second-step',
                content: '编辑表格定义所需要的数据字段!',
            },
            {
                target: '.my-third-step',
                content: '点击进行接口mock获取数据响应!',
            },
            {
                target: '.my-four-step',
                content: '对响应的数据进行编辑操作!',
            },
            {
                target: '.my-five-step',
                content: '复制该api链接进行使用!',
            },
            {
                target: '.my-six-step',
                content: '查看已配置过的数据接口列表!',
            },
        ]
    };

    handleJoyrideCallback = (data:any) => {
        const { action, index, status, type } = data;

        if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
            // Update state to advance the tour
            this.setState({
                stepIndex: index + (action === ACTIONS.PREV ? -1 : 1),
                run:true
            });
        }
        else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            // Need to set our running state to false, so we can restart if we click start again.
            this.setState({ run: false });
        }

        console.log(data); //eslint-disable-line no-console
    };

   render() {
       const {  run,steps ,stepIndex} = this.state;
       const isFirst = localStorage.getItem('isFirst')
       let tempRun = run
       if(!isFirst){
           tempRun = true
           localStorage.setItem('isFirst','has been read the guide')
       }
       console.log(tempRun)
       return  <Joyride
           steps={steps}
           continuous={true}
           stepIndex={stepIndex}
           callback={this.handleJoyrideCallback}
           showProgress={true}
           scrollToFirstStep={true}
           run={tempRun}
       />
   }

}