import React from 'react';
import { useState } from 'react';
import useEth from '../contexts/EthContext/useEth';
const Home = () => {
    const {
        state: { contract, accounts },
        setIsWalletConnectClicked,
        isWalletConnectClicked,
        isInit
      } = useEth();
      const [rr, setRr] = useState(false)
    const handleConnectButton = (e) => {
        e.preventDefault();
        setIsWalletConnectClicked(true);
    }
  return (
    <div>
      <button onClick={handleConnectButton}>Connect Wallet</button>
      <br /><br />
      {isWalletConnectClicked && <>Je suis connecté</>} <br /><br />
      {isWalletConnectClicked && isInit && <>{accounts[0]}</>}
      <br /><br />
      {isInit.toString()}
    </div>
  )
}

export default Home
