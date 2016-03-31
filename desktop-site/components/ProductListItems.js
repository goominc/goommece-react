// Copyright (C) 2016 Goom Inc. All rights reserved.

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { CloudinaryImage } from 'react-cloudinary';

import * as _ from 'lodash';

import ResponsiveImage from 'components/snippet/ResponsiveImage';
import productUtil, { getProductMainPrice, initColorsAndSizes } from 'commons/utils/productUtil';
import brandUtil from 'commons/utils/brandUtil';

export default React.createClass({
  propTypes: {
    products: PropTypes.array.isRequired,
    changeMainImage: PropTypes.func,
  },
  contextTypes: {
    activeCurrency: PropTypes.string,
  },
  render() {
    const { products, changeMainImage } = this.props;
    const { activeCurrency } = this.context;

    const renderItem = (item) => {
      // 2016. 03. 05. [heekyu] calc mainImage in parent Container
      // const image = getProductMainImage(item.topHit || item);
      const image = item.mainImage;
      const renderVariantImages = () => {
        const parsed = initColorsAndSizes(item.productVariants || []);
        const colors = _.get(parsed, 'variantAttributes.colors');
        const renderColorImage = (color) => (
          <div key={color} className="variant-item" onClick={() => changeMainImage(item.id, colors[color].img)}>
            <ResponsiveImage image={colors[color].img} width={220}>
              {color}
            </ResponsiveImage>
          </div>
        );
        return Object.keys(colors).map((color) => renderColorImage(color));
      };
      return (
        <div key={item.id} className="product-list-item-wrap product-list-first-item">
          <div className="product-list-item-box">
            <ResponsiveImage image={image} link={`/products/${item.id}`} width={220} />
            <Link to={`/products/${item.id}`}>
              <div className="product-title">
                {productUtil.getName(item)} <br />
                {brandUtil.getName(item.brand)}
              </div>
            </Link>
            <div className="variant-image-container">
              {renderVariantImages()}
            </div>
            <div className="product-price">
              {activeCurrency} {getProductMainPrice(item, activeCurrency)}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="container">
        <div className="product-list-item-row">
          {products.map(renderItem)}
        </div>
      </div>
    );
  },
});
