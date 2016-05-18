// Copyright (C) 2016 Goom Inc. All rights reserved.

import React, { PropTypes } from 'react';
import _ from 'lodash';
import Decimal from 'decimal.js-light';

import brandUtil from 'commons/utils/brandUtil';
import numberUtil from 'commons/utils/numberUtil';
import orderUtil from 'commons/utils/orderUtil';

export default React.createClass({
  propTypes: {
    order: PropTypes.object,
  },
  contextTypes: {
    activeCurrency: PropTypes.string,
    currencySign: PropTypes.object,
  },
  render() {
    const { order } = this.props;
    const { activeCurrency, currencySign } = this.context;
    const getPrice = (type) => order[`${type}${activeCurrency}`];
    const formatPrice = (type) => {
      return numberUtil.formatPrice(getPrice(type), activeCurrency, currencySign);
    };
    const sum = (types) => {
      let ret = new Decimal(0);
      types.forEach((type) => (ret = ret.add(order[`${type}${activeCurrency}`] || 0)));
      return ret.toNumber();
    };
    const orderPrice = numberUtil.formatPrice(
      sum(['tax', 'handlingFee', 'shippingCost']), activeCurrency, currencySign);
    const renderAdjustment = (adjustment) =>
    (
      <div key={adjustment.id}>
        <div className="left">+</div>
        <div className="right">{brandUtil.getName(adjustment.brand)}: {numberUtil.formatPrice(adjustment[activeCurrency], activeCurrency, currencySign)}</div>
      </div>
    );
    const subtotalPrice = formatPrice('subtotal');
    const adjustmentPrice = formatPrice('adjustmentTotal');
    const taxPrice = formatPrice('tax');
    const handlingFeePrice = formatPrice('handlingFee');
    const shippingCostPrice = formatPrice('shippingCost');
    const totalPrice = formatPrice('total');
    const renderFinalPrice = () => {
      if (order.finalTotalKRW) {
        const totalGap = +getPrice('finalTotal') - +getPrice('total');
        if (totalGap === 0) {
          return (
            <div className="cell content-cell">
              <div className="final-price-line">
                <div className="left">최종금액</div>
                <div className="right">{totalPrice}</div>
              </div>
            </div>
          );
        }
        const priceGap = sum(['finalTax', 'finalHandlingFee', 'finalSubtotal'])
          - sum(['tax', 'handlingFee', 'subtotal']);
        const shippingCostGap = +getPrice('finalShippingCost') - +getPrice('shippingCost');
        const formatGap = (gap) => (gap === 0 ? 0 : `-${numberUtil.formatPrice(-gap, activeCurrency, currencySign)}`);
        return (
          <div className="cell" style={({ paddingBottom: '40px' })}>
            <div className="sub-title-line">
              <div className="left">환불금액</div>
              <div className="right">{formatGap(totalGap)}</div>
            </div>
            <div className="content-refund-cell">
              <div className="left">-</div>
              <div className="right">주문조정: {formatGap(priceGap)}</div>
              <div className="left">-</div>
              <div className="right">배송차액: {formatGap(shippingCostGap)}</div>
            </div>
            <div className="final-price-line">
              <div className="left">최종금액</div>
              <div className="right">{formatPrice('finalTotal')}</div>
            </div>
          </div>
        );
      }
      return (
        <div className="cell content-cell">
          <div className="final-price-line">
            <div className="left">결제금액</div>
            <div className="right">{totalPrice}</div>
          </div>
        </div>
      );
    };
    return (
      <div className="payment-info-container">
        <div className="row">
          <div className="cell title-cell">
            <div className="title">상품금액</div>
            <div className="price">{subtotalPrice}</div>
          </div>
          <div className="cell title-cell">
            <div className="title">주문비용</div>
            <div className="price">{orderPrice}</div>
          </div>
          <div className="cell title-cell">
            <div className="title">기타</div>
            <div className="price">{adjustmentPrice}</div>
          </div>
          <div className="cell title-cell">
            <div className="title">결제금액</div>
            <div className="price">{order.paymentStatus === 200 ? 0 : totalPrice}</div>
          </div>
        </div>
        <div className="row">
          <div className="cell content-cell">
            <div className="left">+</div>
            <div className="right">상품가격: {subtotalPrice}</div>
          </div>
          <div className="cell content-cell">
            <div className="left">+</div>
            <div className="right">부가세(10%): {taxPrice}</div>
            <div className="left">+</div>
            <div className="right">사입비(3.3%): {handlingFeePrice}</div>
            <div className="left">+</div>
            <div className="right">배송비: {shippingCostPrice}</div>
          </div>
          <div className="cell content-cell">
            {_.get(order, 'adjustments', []).map(renderAdjustment)}
          </div>
          {renderFinalPrice()}
        </div>
      </div>
    );
  },
});
