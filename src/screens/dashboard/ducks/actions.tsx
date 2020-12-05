import { createActions } from 'redux-actions';

const actions = createActions<any>({
  GET_LIST_TRADING_COPIES_ACTION: (body, callback) => ({ body, callback }),
  CREATE_TRADING_COPY_ACTION: (body, callback) => ({ body, callback }),
  GET_LIST_EXPERTS_ACTION: (body, callback) => ({ body, callback }),
  SET_LIST_EXPERTS_ACTION: (data) => data,
  TRANSFER_AMOUNT_ACTION: (body, callback) => ({ body, callback }),
});
export const {
  getListTradingCopiesAction,
  createTradingCopyAction,
  getListExpertsAction,
  setListExpertsAction,
  transferAmountAction,
} = actions;
