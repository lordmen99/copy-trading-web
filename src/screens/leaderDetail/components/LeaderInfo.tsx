import React from 'react';

const LeaderInfo = ({ setShowModalStart, expertInfo }) => {
  return (
    <div className="leader-info">
      <div className="wrapper-top">
        <div className="info-wrapper">
          <div className="avatar-wrapper">
            <div className="avatar">
              {expertInfo.result.avatar ? (
                <img style={{ height: '100%', borderRadius: '100%' }} src={expertInfo.result.avatar} alt="avatar" />
              ) : (
                <p>{expertInfo.result?.username.split('')[0]}</p>
              )}
            </div>
          </div>
          <div className="name-wrapper">
            <p className="name">{expertInfo.result?.username}</p>
            <p className="sub">
              <span className="expert">Expert</span>
              <span className="percent">5%</span>
              Profit sharing
            </p>
          </div>
        </div>
      </div>
      <div className="wrapper-bottom">
        <div className="wrapper-left">
          <p className="value">
            {expertInfo.info.gain_rate_last_month >= 0
              ? ` + ${expertInfo.info.gain_rate_last_month}`
              : ` - ${expertInfo.info.gain_rate_last_month}`}{' '}
            %
          </p>
          <p className="sub">Gain last Months</p>
          {expertInfo.info.gain_rate_months >= 0 ? (
            <p className="sub-green">+{expertInfo.info.gain_rate_months} % in month</p>
          ) : (
            <p className="sub-red">-{expertInfo.info.gain_rate_months} % in month</p>
          )}
        </div>
        <div className="wrapper-right">
          <div className="button-wrapper">
            <p>{expertInfo.info.copier} Copier</p>
            <button onClick={() => setShowModalStart(true)}>Start Copy</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderInfo;
