import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import { getProductMainImage } from 'commons/utils/productUtil';

export default React.createClass({
  propTypes: {
    products: PropTypes.array.isRequired,
  },
  contextTypes: {
    activeLocale: PropTypes.string,
    activeCurrency: PropTypes.string,
  },
  render() {
    const { products } = this.props;
    const { activeCurrency } = this.context;

    const prodDiv = products.map((product) => {
      const img = getProductMainImage(product);
      if (img) {
        return (
            <li key={product.id}>
              <Link className="product-image" to={`/products/${product.id}`}>
                <div className="inner-wrap">
                  <img src={getProductMainImage(product).url} />
                </div>
                { /*<div className="product-cost">
                  <strong>{getProductMainPrice(product, activeCurrency)} {activeCurrency}</strong>
                </div>
                 <div className="product-cost">1000 Orders</div> */ }
              </Link>
            </li>
          );
      }
      return (
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>
              <div className="product-image">
                <img />
              </div>
              { /*<div className="product-cost">
                <strong>{getProductMainPrice(product, activeCurrency)} {activeCurrency}</strong>
              </div>
               <div className="product-cost">1000 Orders</div> */ }
            </Link>
          </li>
        );
    });

    return (
      <section className="promotion-block today-deals">
        <header>
          <div style={({ padding: '0 8px' })}>동대문 핫신상</div>
          {/*<Link to="/categories/4">동대문 핫신상</Link>*/}
        </header>
        <article>
          <ul className="clearfix product-container">
            {prodDiv}
          </ul>
        </article>
        <Link to="/categories/4" className="ui-button ui-button-third">View more&nbsp;</Link>
      </section>
    );
  },
});
