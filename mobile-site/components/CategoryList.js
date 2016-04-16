import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { getProductMainImage, getProductMainPrice } from 'commons/utils/productUtil';
import productUtil from 'commons/utils/productUtil';

export default React.createClass({
  propTypes: {
    categories: PropTypes.object.isRequired,
    currentCategory: PropTypes.object.isRequired,
    products: PropTypes.array,
  },
  contextTypes: {
    activeLocale: PropTypes.string,
    activeCurrency: PropTypes.string,
  },

  render() {
    const { currentCategory } = this.props;
    const { activeLocale } = this.context;
    const renderCategory = () => {
      if (currentCategory && currentCategory.children) {
        return currentCategory.children.map((cat) => {
          let cateLink;
          if (cat.children && cat.children.length === 0) {
            cateLink = `/categories/${cat.id}`;
          } else {
            cateLink = `/categoryList/${cat.id}`;
          }

          return (
            <li key={cat.id}>
              <span className={`icon-${cat.id}`}></span>
              <Link to={cateLink} rel="nofollow">{cat.name[activeLocale]}</Link>
            </li>
            );
        });
      }
      return null;
    };

    const renderProducts = () => {
      const { products } = this.props;
      const { activeCurrency } = this.context;
      if (!products || !products.length) {
        return null;
      }

      return products.map((product) => {
        const image = getProductMainImage(product.topHit || product);
        const renderImage = () => {
          if (!image) {
            return (<img />);
          }
          return (<img src={image.url} />);

          /* if (!image.publicId) {
            return (<img src={image.url} />);
          }
          return (
            <CloudinaryImage publicId={image.publicId}
              version={image.version}
              options={ { width: 220, height: 330 } }
            />
          ); */
        };
        return (
          <li className="ms-gallery-item" key={product.id}>
            <div className="ms-gallery-inner">
              <Link to={`/products/${product.id}`}>
                <div className="ms-gallery-pic">
                  {renderImage()}
                </div>
                <div className="ms-gallery-info">
                  <span className="ms-gallery-dprice">
                    <em>{activeCurrency} {getProductMainPrice(product, activeCurrency)}</em>
                  </span>
                </div>
              </Link>
            </div>
          </li>
          );
      });
    };

    return (
      <article className="category-container">
        <ul className="cate-list clearfix">
          {renderCategory()}
        </ul>
        <section className="products-wrap">
          <div className="recommend-wrap" id="recommend-wrap">
            <ul className="ms-gallery" id="recommend-list">
              {renderProducts()}
            </ul>
            <div className="loading"></div>
          </div>
        </section>
      </article>
    );
  },
});
