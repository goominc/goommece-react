import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { loadProducts } from '../redux/actions';
import loadEntities from '../redux/util/loadEntities';

import BreadCrumb from '../components/BreadCrumb';
import ProductListLeft from '../components/ProductListLeft';
import ProductListItems from '../components/ProductListItems';

const ProductList = React.createClass({
  propTypes: {
    products: PropTypes.object.isRequired,
  },
  componentDidMount() {
    this.props.loadProducts();
  },
  render() {
    const { products } = this.props;
    const path = [
      {link:'/', name: 'home'},
      {link:'/cart', name: 'cart'},
    ];
    return (
      <div className="container-table">
        <ProductListLeft />
        <div className="product-list-right-box">
          <BreadCrumb path={path} />
          <div className="product-list-search-box"></div>
          <ProductListItems products={products} />
        </div>
      </div>
    );
  },
});

export default connect(
  state => loadEntities(state, 'products', 'products'),
  { loadProducts }
)(ProductList);
