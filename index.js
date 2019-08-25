import React from 'react';

class Mod extends React.component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (<div>
            <div onClick={()=>{console.log(this)}}>11</div>
            <div>22</div>
        </div>)
    }
}