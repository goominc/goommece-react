import React, { PropTypes } from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin'; // for manage form input...
import _ from 'lodash';

import CheckoutStep1 from 'components/checkout/CheckoutStep1';
import SellerBox from 'components/CartSellerBox';
import i18n from 'commons/utils/i18n';
import orderUtil from 'commons/utils/orderUtil';

export default React.createClass({
  propTypes: {
    addressFields: PropTypes.array,
    addresses: PropTypes.object,
    doCheckout: PropTypes.func,
    step: PropTypes.string.isRequired,
    order: PropTypes.object.isRequired,
  },
  contextTypes: {
    activeLocale: PropTypes.string,
    activeCurrency: PropTypes.string,
    router: PropTypes.object.isRequired,
  },
  mixins: [LinkedStateMixin],
  getInitialState() {
    return {};
  },
  renderCheckoutInformations() {
    return (
      <CheckoutStep1 {...this.props} />
    );
  },
  renderPayments() {
    const { order, doCheckout } = this.props;
    const { activeCurrency } = this.context;
    const handleCheckout = () => {
      if (this.refs.gopaymethod.value) {
        doCheckout(order.id, this.refs);
      } else {
        window.alert('Please select a pay method.'); // eslint-disable-line no-alert
      }
    };
    return (
      <form id="checkout" method="POST">
        <div>{activeCurrency} {order[`total${activeCurrency}`]}</div>
        <select name="gopaymethod" ref="gopaymethod">
          <option value="">[ 결제방법 선택 ]</option>
          <option value="Card">신용카드 결제</option>
          <option value="VBank">무통장 입금</option>
        </select>
        <input type="hidden" name="version" value="1.0" />
        <input type="hidden" name="mid" ref="mid" />
        <input type="hidden" name="oid" ref="oid" />
        <input type="hidden" name="goodname" value="의류" />
        <input type="hidden" name="price" ref="price" />
        <input type="hidden" name="currency" value="WON" />
        <input type="hidden" name="buyername" value="LINKSHOPS" />
        <input type="hidden" name="buyertel" value="010-2000-1234" />
        <input type="hidden" name="buyeremail" ref="buyeremail" />
        <input type="hidden" name="timestamp" ref="timestamp" />
        <input type="hidden" name="signature" ref="signature" />
        <input type="hidden" name="returnUrl" ref="returnUrl" />
        <input type="hidden" name="mKey" ref="mKey" />
        <button type="button" className="btn btn-default" onClick={handleCheckout}>
          CHECKOUT
        </button>
      </form>
    );
  },
  renderVBank() {
    const { order } = this.props;
    if (order.status === 1) {
      const payment = _.find(order.payments, (p) => p.type === 0 && p.status === 2 && p.data.payMethod === 'VBank');
      if (payment) {
        return (
          <div>
            <div>입금은행: {payment.data.vactBankName}</div>
            <div>입금계좌번호: {payment.data.VACT_Num}</div>
            <div>예금주명: {payment.data.VACT_Name}</div>
            <div>송금자명: {payment.data.VACT_InputName}</div>
          </div>
        );
      }
    }
  },
  renderDone() {
    const { order } = this.props;

    // const variants = order.orderProducts.map((p) => Object.assign({}, p.productVariant, { count: p.quantity }));
    const brands = orderUtil.collectByBrands(order.orderProducts);
    return (
      <div>
        {brands.map((brand) => (<SellerBox key={brand.brand.id} {...this.props} brand={brand} />))}
        <div>Total: KRW {order.totalKRW}</div>
        <div>Status: {i18n.get(`enum.order.status.${order.status}`)}</div>
        {this.renderVBank()}
      </div>
    );
  },
  render() {
    const { order, step } = this.props;
    if (!order) {
      return (
        <div></div>
      );
    }
    function getProgressbarClass(progress) {
      return `checkout-progress-arrow progress-${progress} ${step === progress ? 'progress-active' : ''}`;
    }

    const getContent = () => {
      switch (step) {
        case 'review': { // eslint-disable-line indent
          return this.renderCheckoutInformations();
        }
        case 'payment': { // eslint-disable-line indent
          return this.renderPayments();
        }
        case 'done': { // eslint-disable-line indent
          return this.renderDone();
        }
        default: { // eslint-disable-line indent
          window.alert('Invalid Checkout Page State!'); // eslint-disable-line no-alert
        }
      }
      return '';
    };

    const handleClickStep = (newStep) => {
      if (step !== 'done' && newStep !== 'done' && step !== newStep) {
        this.context.router.push(`/orders/${order.id}/checkout/${newStep}`);
      }
    };
    const endClassName = `checkout-progress-end ${step === 'done' ? 'progress-active' : ''}`;

    return (
      <div className="checkout-container-wrap">
        <div className="checkout-container">
          <div className={getProgressbarClass('review')} onClick={() => handleClickStep('review')}>
            checkout informations
          </div>
          <div className="checkout-progress-shadow progress-1-shadow"></div>
          <div className={getProgressbarClass('payment')} onClick={() => handleClickStep('payment')}>
            payment
          </div>
          <div className="checkout-progress-shadow progress-2-shadow"></div>
          <div className={getProgressbarClass('done')} onClick={() => handleClickStep('done')}>
            done
          </div>
          <div className={endClassName}></div>
          {getContent()}
        </div>
      </div>
    );
  },
});
