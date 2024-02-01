import React, { useEffect } from "react";
import { useState } from "react";
import useEth from "../contexts/EthContext/useEth";
import Web3 from "web3";
import usdc from "../contracts/usdc.json";
const Home = () => {
  const {
    state: { contract, accounts },
    setIsWalletConnectClicked,
    isWalletConnectClicked,
    isInit,
  } = useEth();
  const [rr, setRr] = useState(false);
  const handleConnectButton = (e) => {
    e.preventDefault();
    setIsWalletConnectClicked(true);
  };

  useEffect(() => {
    const init = async () => {
      const web3 = new Web3(Web3.givenProvider);
      // const { abi } = require("../contracts/usdc.json");
      const cont = new web3.eth.Contract(
        usdc.abi,
        "0xFEca406dA9727A25E71e732F9961F680059eF1F9"
      );

      const symbol = await cont.methods.symbol().call();
      console.log(symbol);
      const accountss = await web3.eth.requestAccounts();
      console.log(accountss);
      const approve = await cont.methods
        .approve("0x1d4dDa4C3E31eD931310743B33FdC4770AeA6D62", 1000000)
        .send({ from: accountss[0] });
      console.log(approve);
    };
    init();
  }, []);
  return (
    <div>
      <button onClick={handleConnectButton}>Connect Wallet</button>
      <br />
      <br />
      {isWalletConnectClicked && <>Je suis connecté</>} <br />
      <br />
      {isWalletConnectClicked && isInit && <>{accounts[0]}</>}
      <br />
      <br />
      {isInit.toString()}
    </div>
  );
};

export default Home;
