import React, { useState }from 'react';
import './App.css';
import { ethers } from "ethers";
import TokenSelector from './components/TokenSelector';
import ActiveNFT from './components/ActiveNFT';

declare global {
  interface Window {
    ethereum:any;
  }
}

// A Web3Provider wraps a standard Web3 provider, which is
// what Metamask injects as window.ethereum into each page
const provider = new ethers.providers.Web3Provider(window.ethereum)

// The Metamask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, you need the account signer...

const connect = async () => {
  await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
}

/**
 * 
 * A component that uses the Covalent API to get a list of the user's wallet's ERC20 tokens,
 *  with an override to manually enter token address
 * 
  * A component that uses the Covalent API to get a list of the user's wallet's ERC721 and ERC1155 nfts, 
  with an override to manually enter token address, token id, and token quantity (for ERC1155)
    * Components should take in a ethers.providers.JsonRpcProvider provider object through its props
 */
const getProv = () => {
  const prov = new ethers.providers.JsonRpcProvider()
  debugger
  return prov;
}
const  getNet = async () => {
  const net = await provider.getNetwork()
  return net
}
function App() {
  connect();
  const [activeNFT, setActiveNFT] = useState('');

  const displayNft = (nft: any) => {
    if (activeNFT) {
      return <ActiveNFT nft={nft} />
    }
    return (
      <div className="nft__placeholder">
        Select an NFT
      </div>
    );
  }
  const handleSelectNFT = nft => {
    setActiveNFT(nft);
  }

  return (
    <div className="App">
      <div className="panel__container">
        <div className="nft__display">
          {displayNft()}
        </div>
        <div className="panel">
          <div className="tokenInput">
            Address: {}
            <TokenSelector provider={provider} onSelectNFT={handleSelectNFT}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
