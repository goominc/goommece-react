import React, { PropTypes } from 'react';

export default React.createClass({
  propTypes: {
    cart: PropTypes.object.isRequired,
    updateCount: PropTypes.func,
    removeProduct: PropTypes.func,
    buy: PropTypes.func,
  },
  renderVariant(variant) {
    const { updateCount, removeProduct, buy } = this.props;
    function handleQuantity(event) {
      return updateCount(variant, event.target.value);
    }
    function handleRemove() {
      removeProduct(variant);
    }
    function handleBuy() {
      buy(variant);
    }
    function renderBuyButton() {
      const buttonCells = [];
      if (removeProduct) {
        buttonCells.push(<td><button onClick={handleRemove}>Remove</button></td>);
      }
      if (buy) {
        buttonCells.push(<td><button onClick={handleBuy}>Buy</button></td>);
      }
      return buttonCells;
    }
    return (
      <tr key={variant.id}>
        <td><img src="http://www.linkshops.com/media/catalog/product/cache/1/thumbnail/120x180/9df78eab33525d08d6e5fb8d27136e95/3/f/3f8a6201-copy.jpg" />
          <span className="product-description">{variant.sku}</span></td>
        <td><input type="number" name="quantity" min="1" max="100" onChange={handleQuantity} defaultValue={variant.count}/></td>
        <td>KRW {variant.price.KRW}</td>
        {renderBuyButton()}
      </tr>
    );
  },
  render() {
    const { cart, removeProduct, buy, children } = this.props;
    if (!cart) {
      return (
        <div>Error! No Cart</div>
      );
    }
    const variants = cart.productVariants || [];
    function renderHead() {
      const renderBuyCell = () => {
        const buttonCells = [];
        if (removeProduct) {
          buttonCells.push(<td width="10%"></td>);
        }
        if (buy) {
          buttonCells.push(<td width="10%"></td>);
        }
        return buttonCells;
      };
      return (
        <tr>
          <td width="50%">Product Detail</td>
          <td width="15%">Quantity</td>
          <td width="15%">Price</td>
          {renderBuyCell()}
        </tr>
      );
    }
    return (
      <div className="cart-seller-box">
        <div className="cart-seller-title">Seller: Test</div>
        <table>
          <thead>
          {renderHead()}
          </thead>
          <tbody>
          {variants.map(this.renderVariant)}
          </tbody>
        </table>
        {children}
      </div>
    );
  },
});
