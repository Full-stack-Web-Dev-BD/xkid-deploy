import React, { useEffect, useRef, useState } from 'react'
import Web3 from 'web3';
var contract = require("@truffle/contract");
const contractJson = require('./nft/build/contracts/X07Kiddos.json')


const Mint = () => {
    const [isPending, setIsPending] = useState(false)
    const [isMinting, setIsMinting] = useState(0)
    const contractInstance = useRef(null)
    const [isWhitelist, setIsWhitelist] = useState(null)
    const [acc, setAcc] = useState(null)
    const [myNFT, setMyNFT] = useState(0)
    useEffect(() => {
        async function initMe() {
            setAcc(await window.ethereum.enable())
            window.web3 = new Web3(window.web3.currentProvider);
            var chainID = await window.web3.eth.getChainId()
            if (chainID !== 3) return alert("Please switch your network to Ropsten in Metamask in order to work ")

            var MyContract = contract(contractJson)
            MyContract.setProvider(window.web3.currentProvider);
            contractInstance.current = await MyContract.deployed()
            console.log("contract", contractInstance.current)
            var isWhiteList = await contractInstance.current.whitelistOnly()
            balanceUpdate()
            setIsWhitelist(isWhiteList)
        }
        initMe()
    }, [])
    async function balanceUpdate() {
        var chainID = await window.web3.eth.getChainId()
        if (chainID !== 3) return alert("Please switch your network to Ropsten in Metamask in order to work ")
        var myBalance = await contractInstance.current.balanceOf((await window.ethereum.enable())[0])
        setMyNFT(myBalance.toNumber())
    }
    async function mint() {
        var chainID = await window.web3.eth.getChainId()
        if (chainID !== 3) return alert("Please switch your network to Ropsten in Metamask in order to work ")
        setIsMinting(1)
        console.log('instance', contractInstance.current)
        var tx = await contractInstance.current.mint(acc[0], 1, { from: acc[0] })
        console.log(tx)
        await balanceUpdate()
        setIsMinting(2)

    }
    async function disableWL() {
        var chainID = await window.web3.eth.getChainId()
        if (chainID !== 3) return alert("Please switch your network to Ropsten in Metamask in order to work ")
        setIsPending(true)
        var tx = await contractInstance.current.activateWhitelist(false, { from: acc[0] })
        console.log(tx)
        setIsPending(false)
        setIsWhitelist(!isWhitelist)
    }
    return (
        <div className='container  col-md-4 offset-md-4'>
            <div className='mt-5 card p-4'>
                {
                    isMinting === 1 ?
                        <h2 className='alert alert-warning' > <span className='mr-3' ><i class="far fa-clock"></i></span>  Minting in progress ... </h2> : ''
                } {
                    isPending ?
                        <h2 className='alert alert-warning' > <span className='mr-3' ><i class="far fa-clock"></i></span>  Requiest in pending ... </h2> : ''
                }
                {
                    isMinting === 2 ?
                        <h2 className='alert alert-success' > <span className='mr-3' ><i class="far fa-check-circle"></i></span>  Minting Success !!   </h2> : ''
                }
                <h4>Ropsten Test Network </h4>
                <h5>You Minted {myNFT} NFT's</h5>
                <div className='card-action'>
                    <>
                        {
                            isWhitelist ?
                                <button className='btn btn-info' onClick={e => disableWL(!isWhitelist)} > Deactivated WL </button>
                                : <button className='btn btn-info' onClick={e => disableWL(!isWhitelist)} >  Activate WL </button>
                        }
                    </>
                    <span className='p-1' ></span>
                    <button className='btn btn-success' onClick={e => mint()} >mint</button>
                </div>
            </div>
        </div>
    )
}

export default Mint
