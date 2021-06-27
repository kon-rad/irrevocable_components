import './ActiveNFT.css';

type Props = {
  nft: any
};

const ActiveNFT = ({ nft }: Props) => {
  return (
    <div>
      <div className="active__nft">
        <div className="TS__nftImgWrapper">
        <img className="TS__nftImage" src={nft.image}/>
        </div>
        <div className="TS__nftName">{nft.nft_name}</div>
        <div className="TS__nftId">ID: {nft.token_id}</div>
        <div className="TS__nftLink"><a target="_blank" href={`https://opensea.io/assets/${nft.contract_address}/${nft.token_id}`}>View on OpenSea</a></div>
        <div className="TS__nftOGOwner">{nft.original_owner}</div>
      </div>
    </div>
  )
}
export default ActiveNFT;