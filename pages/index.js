import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, {useEffect, useState, useRef} from "react";
import Web3Modal from "web3modal";
import{ Contract, providers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { AZOGDEV_DAO_CONTRACT_ADDRESS, AZOGDEV_NFT_CONTRACT_ADDRESS, AZOGDEV_DAO_ABI, AZOGDEV_NFT_ABI } from "../constants";
import Link from 'next/link';
import Header from './Header';
import Footer from './Footer';
import { useRouter } from 'next/router';
export default function Home() {
  const router = useRouter();
  const[treasuryBalance, setTreasuryBalance] = useState("0");
  const[numProposals, setNumProposals] = useState("0");
  const[proposals, setProposals] = useState([]);
  const[nftBalance, setNftBalance] = useState(0);
  const[nftTokenId, setNftTokenId] = useState("");
  const[selectedTab, setSelectedTab] = useState("");
  const[loading, setLoading] = useState(false);
  const[walletConnected, setWalletConnected] = useState(false);
  const web3Refs = useRef();

  const connectWallet = async()=>{
    try{
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch(err){
      console.log(err);
    }
  };

  const getDAOTreasuryBalance = async()=>{
    try{
      const provider = await getProviderOrSigner();
      const balance = await provider.getBalance(
        AZOGDEV_DAO_CONTRACT_ADDRESS
      );
      setTreasuryBalance(balance.toString());
    } catch(err){
      console.log(err);
    }
  };

  const getNumOfProposalsInDAO = async()=>{
    try{
      const provider = await getProviderOrSigner();
      const contract = await getDaoContractInstance(provider);
      const daoNumProposals = await contract.numProposals();
      setNumProposals(daoNumProposals.toString());
    } catch(err){
      console.log(err);
    }
  };

  const getUserNFTBalance = async()=>{
    try{
      const signer = await getProviderOrSigner(true);
      const nftContract = getAzogdevsNFTContractInstance(signer);
      const balance = await nftContract.balanceOf(signer.getAddress());
      setNftBalance(balance.toString());
    } catch(err){
      console.log(err);
    }
  };

  const createProposal = async()=>{
    try{
      const signer = await getProviderOrSigner(true);
      const daoContract = getDaoContractInstance(signer);
      const txn = await daoContract.createProposal(nftTokenId);
      setLoading(true);
      await tx.wait();
      setLoading(false);
    } catch(err){
      console.log(err);
      window.alert(err.data.message);
    }
  };

  const fetchProposalById = async()=>{
    try{
      const provider = await getProviderOrSigner();
      const daoContract = getDaoContractInstance(provider);
      const proposal = await daoContract.proposals(id);
      const parsedProposal = {
        proposalId: id,
        nftTokenIds: proposal.nftTokenId.toString(),
        deadline: new Date(parseInt(proposal.deadline.toString()) * 1000),
        yesVotes: proposal.yesVotes.toString(),
        noVotes: proposal.noVotes.toString(),
        executed: proposal.executed,
      };
      return parsedProposal;
    } catch(err){
      console.log(err);
    }
  };

  const fetchAllProposals = async()=>{
    try{
      const proposals = [];
      for(let i=0; i<numProposals; i++){
        const proposal = await fetchProposalById(i);
        proposals.push(proposal);
      }
      setProposals(proposals);
      return proposals;
    } catch(err){
      console.log(err);
    }
  };

  const voteOnProposal = async()=>{
    try{
      const signer = await getProviderOrSigner(true);
      const daoContract = getDaoContractInstance(signer);
      let vote = _vote === "YES" ? 0 : 1;
      const txn = await daoContract.voteOnProposal(proposalId, vote);
      setLoading(true);
      await txn.wait();
      setLoading(false);
      await fetchAllProposals();
    } catch(err){
      console.log(err);
      window.alert(err.data.message);
    }
  };

  const executeProposal = async()=>{
    try{
      const signer = await getProviderOrSigner(true);
      const daoContract = getDaoContractInstance(signer);
      const txn = await daoContract.executeProposal(proposalId);
      setLoading(true);
      await txn.wait();
      setLoading(false);
      await fetchAllProposals();
    } catch(err){
      console.log(err);
      window.alert(err.data.message);
    }
  };

  const getProviderOrSigner = async(needSigner = false)=>{
    const provider = await web3Refs.current.connect();
    const web3Provider = await providers.Web3Provider(provider);
    const{chainId} = await web3Provider.getNetwork();
    if(chainId !== 4){
      window.alert("Switch To Rinkeby Network");
      throw new Error("Please Switch To Rinkeby Network");
    }
    if(needSigner){
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  }

  const getDaoContractInstance = (providerOrSigner)=>{
    return new Contract(AZOGDEV_DAO_CONTRACT_ADDRESS, AZOGDEV_DAO_ABI, providerOrSigner);
  };

  const getAzogdevsNFTContractInstance = (providerOrSigner)=>{
    return new Contract(AZOGDEV_NFT_CONTRACT_ADDRESS, AZOGDEV_NFT_ABI, providerOrSigner);
  };

  useEffect(()=>{
    if(!walletConnected){
    web3Refs.current = new Web3Modal({
      network: "rinkeby",
      providerOptions: {},
      disableInjectedProvider: false,
    });

    connectWallet().then(()=>{
      getDAOTreasuryBalance();
      getUserNFTBalance();
      getNumOfProposalsInDAO();
    });
    }
  }, [walletConnected]);

  useEffect(()=>{
    if(selectedTab === "View Proposals"){
      fetchAllProposals();
    }
  }, [selectedTab]);

  function renderTabs(){
    if(selectedTab === "Create Proposal"){
      return renderCreateProposalTab();
    } else if(selectedTab === "View Proposals"){
      return renderViewProposalTab();
    }
    return null;
  }

  function renderCreateProposalTab(){
    if(loading){
      return(
        <div>
          Laoding... Waiting for transaction
        </div>
      );
    } else if(nftBalance === 0){
      return(
        <div>
        <br />
        <div className="text-white text-center p-8 text-2xl">
          You don't own AzogDev NFTs <br />
          <h1> So you cannot create or vote on proposals </h1>
        </div>
        </div>
      );
    } else{
      return(
        <div>
          <h1 className="text-white text-center p-8 text-2xl"> NFT Token ID to Purchase:</h1>
          <input placeholder="0" type="number" onChange={(e)=> setNftTokenId(e.target.value)} />
          <button onClick={createProposal}> Create </button>
        </div>
      );
    }
  }

  function renderViewProposalTab(){
    if(loading){
      return(
        <div className="text-white text-center p-8 text-2xl">
          Loading... Waiting for Transaction
        </div>
      );
    } else if(proposals.length === 0){
      return(
        <div>
        <br />
        <div className="text-white text-center p-8 text-2xl">
          No Proposals Created
        </div>
        </div>
      );
    } else{
      return(
        <div className="text-white text-center p-8 text-xl">
          {proposals.map((p, index)=>{
            <div key={index}>
              <p> Proposal ID: {p.proposalId}</p>
              <p> NFT To Purchase: {p.nftTokenId}</p>
              <p> Deadline: {p.deadline.toLocaleString()}</p>
              <p> Yes Votes: {p.yesVotes}</p>
              <p> No Votes: {p.noVotes}</p>
              <p> Executed: {p.executed.toString()}</p>
              {p.deadline.getTime() > Date.now() && !p.executed ? (
                <div>
                  <button onClick={()=> voteOnProposal(p.proposalId, "YES")}> Vote YES </button>
                  <button onClick={()=> voteOnProposal(p.proposalId, "NO")}> Vote NO </button>
                </div>
              ): p.deadline.getTime() < Date.now() && !p.executed ? (
                <div>
                  <button onClick={()=> executeProposal(p.proposalId)}> Execute Proposal{""} {p.yesVotes > p.noVotes ? "(YES)" : "(NO)"} </button>
                </div>
              ): (
                <div className="text-white text-center p-8 text-2xl"> Proposal Executed </div>
              )}
            </div>
          })}
        </div>
      );
    }
  }

  return (
    <div>
    <Header />
    <br />
      <div className="ml-8 p-8 text-center text-white grid grid-cols-3 gap-4">
        <div className="block p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"> Balance: {nftBalance} </div>
        <div className="block p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"> Treasury Balance: {formatEther(treasuryBalance)} ETH </div>
        <div className="block p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"> Total Number Of Proposals : {numProposals} </div>
      </div>
      <br />
      <div className="h-56 grid grid-cols-4 gap-4 content-center p-8 text-white  dark:bg-gray-800 grid grid-cols-3 content-evenly gap-4">
        <button className="ml-8 block p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 bg-zinc-900 dark:border-gray-700 dark:hover:bg-gray-700" onClick={()=> setSelectedTab("Create Proposal")}> Create Proposal </button>
        <button className="ml-8 block p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 bg-zinc-900 dark:border-gray-700 dark:hover:bg-gray-700" onClick={()=> setSelectedTab("View Proposals")}> View Proposals </button>
        <button className="ml-8 block p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 bg-zinc-900 dark:border-gray-700 dark:hover:bg-gray-700" onClick={()=> router.push('https://minter-app-ravinthiranpartheepan1407.vercel.app/')}>DAO V2</button>
        <button className="ml-8 block p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 bg-zinc-900 dark:border-gray-700 dark:hover:bg-gray-700" onClick={()=> router.push('https://minted-dao-ravi-ravinthiranpartheepan1407.vercel.app/')}>Mint NFT</button>

      </div>
      {renderTabs()}
      <div>
      <br />
      <br />
      <br />
      <Footer />
      </div>
    </div>
  )
}
