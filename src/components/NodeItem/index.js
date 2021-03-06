import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { useWeb3React } from "@web3-react/core";

import './style.css'

import tierABI from '../../constants/ABI/tier.json';
import tierNodeABI from '../../constants/ABI/node.json';
import tokenABI from '../../constants/ABI/token.json';
import { tierAddr, tierNode, nodeManagerAddr, tokenAddr, ftmAddr, usdtAddr, ftm_usdt_lp, ftm_power_lp } from '../../constants/Addresses';

import { getRPC } from '../../redux/actions/rpc'
import { showRPCModal } from '../../redux/actions/modal'

import isEmpty from '../../utils/is-empty';
import notify from '../../utils/notify';

const ETHUnit = 1e18;

const NodeItem = ({ type, name, creationTime, generatorScreen, account, getRPC, showRPCModal }) => {
  const { library } = useWeb3React();
  let nameColor;

  const [btnTitle, setBtnTitle] = useState("Claim Rewards");
  const [rpcGrid, setRPCGrid] = useState("col-1");
  const [typeGrid, setTypeGrid] = useState("col-3");
  const [nameGrid, setNameGrid] = useState("col-4");
  const [rewardGrid, setRewardGrid] = useState("col-4");

  const [tier, setTier] = useState(undefined);
  const [token, setToken] = useState(undefined);
  const [node, setNode] = useState(undefined);
  const [wind, setWind] = useState(undefined);
  const [hydro, setHydro] = useState(undefined);
  const [solar, setSolar] = useState(undefined);
  const [nuclear, setNuclear] = useState(undefined);

  const [reward, setReward] = useState(0);

  useEffect(() => {
    if (generatorScreen.width > 700) {
      setBtnTitle("Claim Rewards");
      setRPCGrid("col-1");
      setTypeGrid("col-3");
      setNameGrid("col-4");
      setRewardGrid("col-4");
    } else if (generatorScreen.width > 600 && generatorScreen.width <= 700) {
      setBtnTitle("Claim Rewards");
      setRPCGrid("col-1");
      setTypeGrid("col-3");
      setNameGrid("col-3");
      setRewardGrid("col-5");
    } else if (generatorScreen.width > 510 && generatorScreen.width <= 600) {
      setBtnTitle("Claim Rewards");
      setRPCGrid("col-1");
      setTypeGrid("col-2");
      setNameGrid("col-3");
      setRewardGrid("col-6");
    } else if (generatorScreen.width > 450 && generatorScreen.width <= 510) {
      setBtnTitle("Claim Rewards");
      setRPCGrid("col-1");
      setTypeGrid("col-2");
      setNameGrid("col-2");
      setRewardGrid("col-7");
    } else if (generatorScreen.width > 400 && generatorScreen.width <= 450) {
      setBtnTitle("Claim");
      setRPCGrid("col-1");
      setTypeGrid("col-2");
      setNameGrid("col-3");
      setRewardGrid("col-6");
    } else if (generatorScreen.width > 350 && generatorScreen.width <= 400) {
      setBtnTitle("Claim");
      setRPCGrid("col-1");
      setTypeGrid("col-2");
      setNameGrid("col-4");
      setRewardGrid("col-5");
    } else {
      setBtnTitle("Claim");
      setRPCGrid("col-2");
      setTypeGrid("col-2");
      setNameGrid("col-4");
      setRewardGrid("col-4");
    }
  }, [generatorScreen])

  useEffect(() => {
    if (isEmpty(library) || isEmpty(account)) {
      setTier(undefined);
      setToken(undefined);
      setNode(undefined);
      setWind(undefined);
      setHydro(undefined);
      setSolar(undefined);
      setNuclear(undefined);
      return;
    }

    const _tier = new library.eth.Contract(tierABI, tierAddr);
    const _token = new library.eth.Contract(tokenABI, tokenAddr);
    const _node = new library.eth.Contract(tierNodeABI, nodeManagerAddr);
    const _wind = new library.eth.Contract(tierNodeABI, tierNode.wind);
    const _hydro = new library.eth.Contract(tierNodeABI, tierNode.hydro);
    const _solar = new library.eth.Contract(tierNodeABI, tierNode.solar);
    const _nuclear = new library.eth.Contract(tierNodeABI, tierNode.nuclear);

    setTier(_tier);
    setToken(_token);
    setNode(_node);
    setWind(_wind);
    setHydro(_hydro);
    setSolar(_solar);
    setNuclear(_nuclear);
  }, [library, account])

  useEffect(() => {
    if (isEmpty(account) || isEmpty(wind)) return;

    const itv = setInterval(() => {
      if (type === "Wind") {
        wind.methods._getRewardAmountOf(account, creationTime).call()
          .then(_reward => {
            setReward(parseFloat(_reward) / ETHUnit);
          })
      } else if (type === "Hydro") {
        hydro.methods._getRewardAmountOf(account, creationTime).call()
          .then(_reward => {
            setReward(parseFloat(_reward) / ETHUnit);
          })
      } else if (type === "Solar") {
        solar.methods._getRewardAmountOf(account, creationTime).call()
          .then(_reward => {
            setReward(parseFloat(_reward) / ETHUnit);
          })
      } else if (type === "Nuclear") {
        nuclear.methods._getRewardAmountOf(account, creationTime).call()
          .then(_reward => {
            setReward(parseFloat(_reward) / ETHUnit);
          })
      }
    }, 3000);

    return () => clearInterval(itv);
  }, [wind, hydro, solar, nuclear, account])

  useEffect(() => {
    getRPC(account);
  }, [])

  if (type === "Nuclear") {
    nameColor = "cl-nuclear";
  } else if (type === "Solar") {
    nameColor = "cl-solar";
  } else if (type === "Hydro") {
    nameColor = "cl-hydro";
  } else if (type === "Wind") {
    nameColor = "cl-wind";
  }

  const claimReward = () => {
    if (type === "Wind") {
      tier.methods.cashoutReward(Number(creationTime), "FLATVERSAL").send({ from: account })
        .then(() => {
          notify("Rewards claimed!", "Check your wallet for your rewards!", "info");
        })
        .catch(err => console.log({ "Claim Rewards Error: ": err }));
    } else if (type === "Hydro") {
      tier.methods.cashoutReward(Number(creationTime), "MICROSCOPIC").send({ from: account })
        .then(() => {
          notify("Rewards claimed!", "Check your wallet for your rewards!", "info");
        })
        .catch(err => console.log({ "Claim Rewards Error: ": err }));
    } else if (type === "Solar") {
      tier.methods.cashoutReward(Number(creationTime), "HUMAN").send({ from: account })
        .then(() => {
          notify("Rewards claimed!", "Check your wallet for your rewards!", "info");
        })
        .catch(err => console.log({ "Claim Rewards Error: ": err }));
    } else if (type === "Nuclear") {
      tier.methods.cashoutReward(Number(creationTime), "SUPERHUMAN").send({ from: account })
        .then(() => {
          notify("Rewards claimed!", "Check your wallet for your rewards!", "info");
        })
        .catch(err => console.log({ "Claim Rewards Error: ": err }));
    }
  }

  const onClickRPC = () => {
    let tierName;

    if (type === "Wind") {
      tierName = "FLATVERSAL";
    } else if (type === "Hydro") {
      tierName = "MICROSCOPIC";
    } else if (type === "Solar") {
      tierName = "HUMAN";
    } else if (type === "Nuclear") {
      tierName = "SUPERHUMAN";
    }

    const checksum = `${name}${creationTime}${tierName}`;

    showRPCModal(type, checksum);
  }

  return <React.Fragment>
    <div className="row border-top mx-0 mt-1 py-1 node-item">
      <div className={`${rpcGrid} d-flex align-items-center rpc-img`} onClick={onClickRPC}>
        <img src="assets/img/icons/fantom.png" alt="fantom" className='icon-size' />
      </div>
      <div className={`${typeGrid} d-flex align-items-center`}>
        <span className="cl-white-80">{type}</span>
      </div>
      <div className={`${nameGrid} d-flex align-items-center`}>
        <span className={`${nameColor} text-truncate`}>{name}</span>
      </div>
      <div className={`${rewardGrid} d-flex align-items-center flex-wrap`}>
        <span className="cl-white-80 me-2">{reward.toFixed(6)}</span>
        {reward === 0 ? (
          <button type='button' className='dark-btn-sm cl-orange-gd fw-bold' disabled={true}>{btnTitle}</button>
        ) : (
          <button type='button' className='dark-btn-sm cl-orange-gd fw-bold' onClick={claimReward}>{btnTitle}</button>
        )}
      </div>
    </div>
  </React.Fragment>;
}

NodeItem.propTypes = {
  showRPCModal: PropTypes.func.isRequired,
  getRPC: PropTypes.func.isRequired,
  generatorScreen: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    generatorScreen: state.generatorScreen,
    account: state.account.myAccount,
  }
}

export default connect(mapStateToProps, { getRPC, showRPCModal })(NodeItem);