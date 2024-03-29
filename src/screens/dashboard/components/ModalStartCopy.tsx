import Toggle from 'containers/components/Toggle';
import { UrlImagesContext } from 'containers/contexts/UrlImagesContext';
import useError from 'containers/hooks/useErrorContext';
import useToastContext from 'containers/hooks/useToastContext';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { formatter, getErrMessage } from 'utils/utilities';
import { createTradingCopyAction, getUserAmountAction, getUserInforAction } from '../ducks/actions';
const initializeData = {
  investment_amount: '',
  maximum_rate: '',
  stop_loss: '',
  taken_profit: '',
};

const ModalStartCopy = ({ isOpen, closeModal, detail, setShowModalTf }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state: any) => state.common.loading);
  const amount = useSelector((state: any) => state.screen.dashBoard.userAmount?.data);
  const userInfor = useSelector((state: any) => state.screen.userInfo.userInfor);
  const { addError } = useError();
  const [haveMaximum, setHaveHaximum] = useState(false);
  const [haveStopLoss, setHaveStopLoss] = useState(false);
  const [haveTakeProfit, setHaveTakeProfit] = useState(false);
  const [data, setData] = useState({ ...initializeData });
  const [isMaxRate, setMaxRate] = useState(false);
  const [isStopLoss, setStopLoss] = useState(false);
  const [isTakeProfit, setTakeProfit] = useState(false);
  const [isNotHaveAmount, setIsNotHaveAmount] = useState(false);
  const [isAdvance, setIsAdvance] = useState(false);
  useEffect(() => {
    if (!isOpen) clearModal();
  }, [isOpen]);
  const { addToast } = useToastContext();
  const urlImg = useContext(UrlImagesContext);
  const handleCreateTradingCopy = () => {
    setIsNotHaveAmount(false);
    const body = {
      id_expert: detail.expert._id,
      investment_amount: parseFloat(data.investment_amount) * 100,
      maximum_rate: haveMaximum && isAdvance ? data.maximum_rate : 0,
      has_maximum_rate: haveMaximum && isAdvance,
      stop_loss: haveStopLoss && isAdvance ? data.stop_loss : 0,
      has_stop_loss: haveStopLoss && isAdvance,
      taken_profit: haveTakeProfit && isAdvance ? data.taken_profit : 0,
      has_taken_profit: haveTakeProfit && isAdvance,
    };
    try {
      dispatch(
        createTradingCopyAction(body, async (err, res: any) => {
          if (err) {
            const message = await getErrMessage(err, null);
            if (message && message.indexOf('Account does not have enough money!') !== -1) {
              setIsNotHaveAmount(true);
              clearModal();
              if (amount < 500) {
                setTimeout(() => {
                  closeModal();
                  setShowModalTf(true);
                }, 300);
              }
              return;
            }
            addError(err, message ? message : null);
          } else {
            dispatch(getUserAmountAction({ source: 'COPY_TRADE' }, () => {}));
            dispatch(getUserInforAction());
            addToast('Copy traded successfully!');
            closeModal();
            clearModal();
          }
        }),
      );
    } catch (error) {
      addError(error, null);
    }
  };

  const handleInputChange = (name, value) => {
    setData((oldState) => ({ ...oldState, [name]: value }));
  };

  const clearModal = () => {
    setHaveHaximum(false);
    setHaveStopLoss(false);
    setHaveTakeProfit(false);
    setData({ ...initializeData });
  };

  const validData: boolean = useMemo(() => {
    let result = true;
    if (!data.investment_amount || parseFloat(data.investment_amount) < 5) {
      result = false;
    }
    if (haveMaximum && isAdvance) {
      if (!data.maximum_rate || parseFloat(data.maximum_rate) < 5 || parseFloat(data.maximum_rate) > 100) {
        if (parseFloat(data.maximum_rate) < 5 || parseFloat(data.maximum_rate) > 100) {
          setMaxRate(true);
        }
        result = false;
      } else {
        setMaxRate(false);
      }
    } else {
      setMaxRate(false);
    }
    if (haveStopLoss && isAdvance) {
      if (!data.stop_loss || parseFloat(data.stop_loss) < 5 || parseFloat(data.stop_loss) > 100) {
        if (parseFloat(data.stop_loss) < 5 || parseFloat(data.stop_loss) > 100) {
          setStopLoss(true);
        }
        result = false;
      } else {
        setStopLoss(false);
      }
    } else {
      setStopLoss(false);
    }
    if (haveTakeProfit && isAdvance) {
      if (!data.taken_profit || parseFloat(data.taken_profit) < 105) {
        if (parseFloat(data.taken_profit) < 105) {
          setTakeProfit(true);
        }
        result = false;
      } else {
        setTakeProfit(false);
      }
    } else {
      setTakeProfit(false);
    }
    return result;
  }, [data, haveMaximum, haveStopLoss, haveTakeProfit, isAdvance]);

  const handleTypeChange = async (value, type) => {
    switch (type) {
      case 'haveMaximum':
        setData((oldState) => ({ ...oldState, maximum_rate: '' }));
        setHaveHaximum(!value);
        break;
      case 'haveStopLoss':
        setData((oldState) => ({ ...oldState, stop_loss: '' }));
        setHaveStopLoss(!value);
        break;
      case 'haveTakeProfit':
        setData((oldState) => ({ ...oldState, taken_profit: '' }));
        setHaveTakeProfit(!value);
        break;
      default:
        break;
    }
  };
  return (
    <Modal
      show={isOpen}
      onHide={() => closeModal()}
      className={`start-copy-modal ${isAdvance ? 'copy-advance' : ''}`}
      size="lg"
    >
      <Modal.Header>
        <div className="wrapper-left">
          <div className="info-wrapper">
            <div className="avatar-wrapper">
              <div className="avatar">
                {detail.expert?.avatar ? (
                  <img src={detail.expert.avatar} alt="avatar" />
                ) : detail.expert?.username ? (
                  <p>{detail.expert?.username.split('')[0]}</p>
                ) : null}
              </div>
            </div>
            <div className="name-wrapper">
              <p className="name">{detail.expert?.username}</p>
              <p className="sub">
                <span className="expert">Expert</span>
                <span className="percent">5%</span>
                Profit sharing
              </p>
            </div>
          </div>
        </div>
        <div className="wrapper-right">
          <div className="close-wrapper">
            <button onClick={() => closeModal()}>
              <img src={`${urlImg}icons/close.svg`} alt="close" />
            </button>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Container fluid={true}>
          <Row>
            <Col md={true} className="wrapper-left">
              <p className="title">Start Copy Now</p>
              <div className="amount-wrapper">
                <p>Amount of investment</p>
                <div className="input-wrapper">
                  <p className="currency">00 USD</p>
                  <NumberFormat
                    thousandSeparator={true}
                    onValueChange={(values) => handleInputChange('investment_amount', values.floatValue)}
                    // onBlur={(event) => validateHandle('maximum_rate', event.target.value)}
                    prefix={'$'}
                    placeholder="$"
                    decimalScale={2}
                    value={data.investment_amount}
                  />
                  {isNotHaveAmount && (
                    <div className="invalid-feedback block">
                      Account does not have enough money! <Link to="/copy-trading/wallet">link to Wallet</Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="wallet-wrapper">
                <p className="total-wallet">
                  Total wallet: <span>{formatter.format(amount ? amount : userInfor?.total_amount)} USD</span>
                </p>
                <p className="sub">500 USD is mininum required deposit for this trader</p>
              </div>
              <div className="advance-wrapper">
                {isAdvance && <button className="active" onClick={() => setIsAdvance(!isAdvance)} />}
                {!isAdvance && <button onClick={() => setIsAdvance(!isAdvance)} />}
                <p style={{ cursor: 'pointer' }} onClick={() => setIsAdvance(!isAdvance)}>
                  Advance setting
                </p>
              </div>
            </Col>
            {isAdvance && (
              <Col md={true} className="wrapper-right">
                <div className="advance-wrapper">
                  <p>Advance setting</p>
                  <p>500 USD is mininum required to start copy</p>
                </div>
                <div className="input-wrapper maxinum">
                  <div className="__header">
                    <p>Maximum</p>
                    <Toggle
                      active={haveMaximum}
                      onClick={(value: boolean) => handleTypeChange(haveMaximum, 'haveMaximum')}
                    />
                  </div>
                  <div className="__input">
                    <NumberFormat
                      disabled={!haveMaximum}
                      onValueChange={(values) => handleInputChange('maximum_rate', values.floatValue)}
                      placeholder="%"
                      suffix={'%'}
                      value={data.maximum_rate}
                      decimalScale={0}
                    />
                    {isMaxRate && (
                      <div className="invalid-feedback block">Maximum is more than 5% and less than 100%</div>
                    )}
                  </div>
                </div>
                <div className="input-wrapper stop-loss">
                  <div className="__header">
                    <p>Stop loss</p>
                    <Toggle
                      active={haveStopLoss}
                      onClick={(value: boolean) => handleTypeChange(haveStopLoss, 'haveStopLoss')}
                    />
                  </div>
                  <div className="__input">
                    <NumberFormat
                      disabled={!haveStopLoss}
                      onValueChange={(values) => handleInputChange('stop_loss', values.floatValue)}
                      placeholder="%"
                      suffix={'%'}
                      value={data.stop_loss}
                      decimalScale={0}
                    />
                    {isStopLoss && (
                      <div className="invalid-feedback block">Stop loss is more than 5% and less than 100</div>
                    )}
                  </div>
                </div>
                <div className="input-wrapper take-profit">
                  <div className="__header">
                    <p>Take profit</p>
                    <Toggle
                      active={haveTakeProfit}
                      onClick={(value: boolean) => handleTypeChange(haveTakeProfit, 'haveTakeProfit')}
                    />
                  </div>
                  <div className="__input">
                    <NumberFormat
                      disabled={!haveTakeProfit}
                      onValueChange={(values) => handleInputChange('taken_profit', values.floatValue)}
                      placeholder="%"
                      suffix={'%'}
                      value={data.taken_profit}
                      decimalScale={0}
                    />
                    {isTakeProfit && <div className="invalid-feedback block">Take profit is more than 105%</div>}
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <div className="button-wrapper">
          <button disabled={!validData || loading} onClick={() => handleCreateTradingCopy()}>
            Start Copy
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalStartCopy;
