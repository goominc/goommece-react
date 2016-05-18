import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import OrderDetailPage from 'components/order/OrderDetailPage';

import { ApiAction } from 'redux/actions';
const { loadOrder } = ApiAction;

const OrderDetail = React.createClass({
  propTypes: {
    orderId: PropTypes.string.isRequired,
    order: PropTypes.object,
    checkout: PropTypes.object,
    loadOrder: PropTypes.func.isRequired,
  },
  componentDidMount() {
    const { orderId } = this.props;
    this.props.loadOrder(orderId);
  },
  contextTypes: {
    ApiAction: PropTypes.object,
  },
  render() {
    const { order } = this.props;
    if (!order) {
      return (<div></div>);
    }
    return (
      <OrderDetailPage {...this.props} addCart={this.context.ApiAction.addCartProduct} />
    );
  },
});

export default connect(
  (state, ownProps) => ({
    orderId: ownProps.params.orderId,
    order: state.entities.orders[ownProps.params.orderId],
    checkout: state.checkout,
  }),
  { loadOrder }
)(OrderDetail);
