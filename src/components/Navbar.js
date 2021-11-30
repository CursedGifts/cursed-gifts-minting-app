import React, { Component } from "react";
import Web3 from "web3";

class Navbar extends Component {

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert("Non-Ethereum browser detected. You should consider installing MetaMask!")
        }
    }


    constructor(props) {
        super(props)
        this.state = {
            account: ""
        }
    }

    render() {
        return ( <
            nav className = "navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow" >
            <
            a className = "navbar-brand col-sm-3 col-md-2 mr-0"
            href = "#"
            target = "_blank"
            rel = "noopener noreferrer" >
            Cursed Gifts <
            /a> <
            li className = "nav-item text-nowrap d-none d-sm-none d-sm-block" >
            <
            button className = "btn-danger btn-sm "
            id = "connect"
            onClick = { this.loadWeb3 } > Connect Wallet <
            /button> < /
            li > < /
            nav >
        );
    }
}


export default Navbar;