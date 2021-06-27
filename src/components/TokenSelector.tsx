import { useState, useRef, useEffect } from 'react';
import { setConstantValue } from 'typescript';
import './TokenSelector.css';

type Props = {
  provider: any,
  onSelectNFT: any,
};

const TokenSelector = ({ provider }: Props) => {
  const [isFetching, setIsFetching] = useState(false);
  const [tokenList, setTokenList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNFT, setActiveNFT] = useState(null);
  async function getAddr(signer: any) {
    const ad = await signer.getAddress();
    return ad;
  }
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // on component mount - fetch nfts
    fetchNfts();
  }, []);

  const signer = provider.getSigner();

  const cov_key:string = process.env.REACT_APP_COVALENT_KEY || '';
  const dev_addr:string = process.env.REACT_APP_DEV_ADDRESS || '';
  const dev_mode:string = process.env.REACT_APP_DEV_MODE || '';

  let addr:string;
  if (dev_mode === '1') {
    addr = dev_addr;
  } else {
    getAddr(signer).then((a) => {
      // setAddr(a);
      addr = a
    });
  }



  const renderTokenItem = (item: any) => {
    // display:
    // image, name, id and opensea link - and original owner
    // contract address + token id
    // 
    console.log('item: ', item);
    return (
      <div className="TS__nft shadow-3" onClick={() => setActiveNFT(item)}>
        <div className="TS__nftImgWrapper">
         <img className="TS__nftImage" src={item.image}/>
        </div>
        <div className="TS__nftName">{item.nft_name}</div>
        <div className="TS__nftId">ID: {item.token_id}</div>
        <div className="TS__nftLink"><a target="_blank" href={`https://opensea.io/assets/${item.contract_address}/${item.token_id}`}>View on OpenSea</a></div>
        <div className="TS__nftOGOwner">{item.original_owner}</div>
      </div>
      )
  }

  const getNftApi = (key: string, addr: string, chain_id: string) => {
    return `https://api.covalenthq.com/v1/${chain_id}/address/${addr}/balances_v2/?nft=true&key=${key}`
  }

  const chain_id: string = '1'
  const fetchNfts = () => {
    setIsFetching(true);
    fetch(getNftApi(cov_key, addr, chain_id))
      .then(resp => resp.json())
      .then(data => {
        const tokens: any = [];
        console.log('data: ', data);
        if (data.data && data.data.items) {
          data.data.items.forEach((item: any) => {
            if (item.type === 'nft') {
              const contractData = {
                contract_address: item.contract_address,
                contract_name: item.contract_name,
                contract_ticker_symbol: item.contract_ticker_symbol,
              }
              if (item.nft_data && item.nft_data.length > 0) {
                item.nft_data.forEach((nft: any) => {
                  tokens.push({
                    contract_address: contractData.contract_address,
                    contract_name: contractData.contract_name,
                    contract_ticker_symbol: contractData.contract_ticker_symbol,
                    original_owner: nft.original_owner,
                    nft_name: nft.external_data?.name,
                    image: nft.external_data?.image,
                    token_id: nft.token_id,
                    token_url: nft.token_url
                  })
                })
              }
            }
          })
          setTokenList(tokens);
          setIsFetching(false);
        }
      })
  }

  useEffect(() => {
    if (!isModalOpen) {
      window.removeEventListener("click", handleDocClick)
      return;
    }

    function handleDocClick(event: any) {
      debugger;
      console.log('handle click', isModalOpen, event.target, modalRef.current);
      if (!modalRef.current?.contains(event.target)) {
        setIsModalOpen(false);
      }
    }

    window.addEventListener("click", handleDocClick);
    return () => window.removeEventListener("click", handleDocClick);
  }, [isModalOpen]);

  const openModal = () => {
    setIsModalOpen(true);
  }
  const closeModal = () => {
    setIsModalOpen(false);
  }

  /*
  * A component that uses the Covalent API to get a list of the user's wallet's ERC721 and ERC1155 nfts, 
  *  with an override to manually enter token address, token id, and token quantity (for ERC1155)
  * Components should take in a ethers.providers.JsonRpcProvider provider object through its props
  * https://www.covalenthq.com/docs/api/#get-/v1/{chain_id}/events/topics/{topic}/ 
  */
  return (
    <div>
      <div className="TS__wrapper">
        <h3 className="TS__label">Consign</h3>
        <div className="TS__btns">
          <button className="TS__selectBtn" onClick={openModal}>Select an NFT</button>
          <button className="TS__advancedBtn">Advanced ▼</button>
        </div>
      </div>
      <div className="TS__modal" style={{display: isModalOpen ? 'block' : 'none'}}>
        <div ref={modalRef} className="TS__modalContent">
          <div className="TS__modalHeader">
            <h3 className="TS__modalTitle">Select an NFT from your wallet</h3>
            <span className="TS__modalClose" onClick={closeModal}>&times;</span>
          </div>
          <div className="TS__modalBody">
            {tokenList.map(renderTokenItem)}
            {isFetching && 'Fetching NFTs ...'}
          </div>
        </div>
        </div>
    </div>
  );
}
export default TokenSelector;