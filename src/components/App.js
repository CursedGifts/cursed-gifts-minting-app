import React, { Component } from 'react';
import Web3 from "web3";
import banner from '../banner.png';
import './App.css';
import Mimics from "../abi/Mimics.json"
import Navbar from "./Navbar"

class App extends Component {

    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
            document.getElementById("connect").innerHTML = "Connected"
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert("Non-Ethereum browser detected. You should consider installing MetaMask!")
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3
            //Load account
        const accounts = await web3.eth.getAccounts()
        console.log(accounts)
        this.setState({ account: accounts[0] })
            //Network ID
        const networkId = await web3.eth.net.getId()
        const networkData = Mimics.networks[networkId]
        this.setState({ web3 })
        if (networkData) {
            const mimics = web3.eth.Contract(Mimics.abi, networkData.address)
            this.setState({ mimics })
            let accountStr = accounts.toString()
            const currentBalance = await mimics.methods.walletOfOwner(accountStr).call()
            this.setState({ currentBalance })
            let myBalance = currentBalance.length
            console.log(myBalance)
            console.log(currentBalance)
                //Counter
            const totalSupplyExp = await mimics.methods.totalSupply().call()
            const totalSupply = totalSupplyExp.toString(16)
            this.setState({ totalSupply })
            const currentSupply = totalSupply - 33
            this.setState({ currentSupply })
            const progress = (currentSupply / 3300) * 100
            this.setState({ progress })
                //Price
            const hexWeiPrice = await mimics.methods.getNFTPrice().call()
            const weiPrice = hexWeiPrice.toString(16)
            const price = web3.utils.fromWei(weiPrice, "ether")
            this.setState({ price })
            const priceN = parseFloat(price)
            this.setState({ priceN })





        } else {
            window.alert("Mimics contract not yet deployed to BSC")
        }


        //Address
        //ABI

    }

    increment = () => {
        if (this.state.count == 5) {
            console.log("Cannot be greater than 5")
        } else {
            this.setState({
                count: this.state.count + 1
            });

        }
    }

    decrement = () => {
        if (this.state.count == 1) {
            console.log("Cannot be lesser than 1")
        } else {
            this.setState({
                count: this.state.count - 1
            });

        }
    }

    claimNFTs = () => {
        let cost = this.state.price;
        let mintAmount = this.state.count;
        let gasLimit = 21000;
        let totalCost = String(cost * mintAmount);
        let totalGasLimit = String(gasLimit * mintAmount);
        let totalCostWei = this.state.web3.utils.toWei(totalCost)
        console.log("Cost: ", totalCost);
        console.log("Gas limit: ", totalGasLimit);
        console.log(`Minting your Mimic...`);
        this.state.mimics.methods
            .mint(mintAmount)
            .send({
                gasLimit: String(totalGasLimit),
                to: "0x04a6921a9be9b1344290b145f276536d30e231fe",
                from: this.state.account,
                value: totalCostWei,
            })
            .once("error", (err) => {
                console.log(err);
                console.log("Sorry, something went wrong please try again later.");
            })
            .then((receipt) => {
                console.log(receipt);
                console.log(
                    `WOW, you have just minted a Mimic!`
                );
            });
    }


    constructor(props) {
        super(props)
        this.state = {
            web3: null,
            account: "",
            mimics: null,
            currentBalance: [],
            totalSupply: 0,
            currentSupply: 0,
            progress: 0,
            price: 0,
            count: 1,
            priceN: 0,
        }
    }

    render() {
        return ( <
            div >
            <
            Navbar account = { this.state.account }
            / >        <
            div className = "container-fluid mt-5" >
            <
            img src = { banner }
            class = "img" /
            >
            <
            /div > <
            div className = "row" >
            <
            main role = "main"
            className = "col-lg-12 ml-auto mr-auto"

            >
            <
            div className = "content mr-auto ml-auto"
            style = {
                {
                    maxWidth: "500px"
                }
            } >
            <
            div className = "card mb-4"
            key = "" >
            <
            div className = "card-header"
            style = {
                {
                    height: "100px"
                }
            } >
            <
            p className = "mint" > MINT YOUR MIMIC < /p> < /div > <
            ul id = "postList"
            className = "list-group list-group-flush" >
            <
            li className = "list-group-item" >
            <
            p className = "cont" > { this.state.currentSupply }
            /3300 </p > < /
            li >

            <
            ul id = "postList"
            className = "list-group list-group-flush" >
            <
            li className = "list-group-item" >
            <
            p className = "costs" > Each Mimic costs { this.state.price } { " " }
            BNB < /p> < /
            li > < /ul> <
            ul id = "counter"
            className = "list-group list-group-flush" >

            <
            div className = "d-flex justify-content-center" >
            <
            button className = 'minus'
            onClick = {
                this.decrement
            } > - < /button> <
            p className = "input"
            size = "10" > { this.state.count } < /p> <
            button className = 'plus'
            onClick = {
                this.increment
            } > + < /button>

            <
            /
            div >



            <
            li key = ""
            className = "list-group-item py-2 text-center" >
            <
            button className = "btn btn-primary"
            onClick = { this.claimNFTs } >
            <
            span >
            MINT <
            /span> < /
            button > < /
            li > <
            /ul> </ul > < /
            div > < /div> < /
            main > < /
            div > <
            /div>



        )
    }
}

export default App;