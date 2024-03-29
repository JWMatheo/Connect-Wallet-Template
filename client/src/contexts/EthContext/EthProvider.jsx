import React, { useReducer, useCallback, useEffect } from "react";
import { useState } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [isWalletConnectClicked, setIsWalletConnectClicked] = useState(false);
  const [isInit, setIsInit] = useState(false);
  const init = useCallback(
    async artifact => {
      if (artifact) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        const { abi } = artifact;
        let address, contract;
        setIsInit(true);
        try {
          address = artifact.networks[networkID].address;
          contract = new web3.eth.Contract(abi, address);
        } catch (err) {
          console.error(err);
        }
        dispatch({
          type: actions.init,
          data: { artifact, web3, accounts, networkID, contract }
        });
      }
    }, []);

  useEffect(() => {
    if (isWalletConnectClicked === true) {
      console.log('isWallet = true');
      const tryInit = async () => {
        console.log('before try');
        try {
          console.log('before init');
          const artifact = require("../../contracts/SimpleStorage.json");
          init(artifact);
          
          console.log('after init');
        } catch (err) {
          console.error(err);
        }
      };
      tryInit();
    } else {
      console.log('Not connected');
    }
  }, [init, isWalletConnectClicked]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch,
      setIsWalletConnectClicked,
      isWalletConnectClicked,
      isInit
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
