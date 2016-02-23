// Copyright (C) 2016 Goom Inc. All rights reserved.

import { normalize } from 'normalizr';
import createFetchAction from './util/createFetchAction';
import * as schemas from './schemas';

export function login(email, password) {
  return createFetchAction({
    type: 'LOGIN',
    endpoint: '/api/v1/login',
    method: 'post',
    body: {
      email,
      password,
    },
    transform: ({ data }) => ({ auth: data }),
  });
}

export function logout() {
  return createFetchAction({
    type: 'LOGOUT',
    endpoint: '/api/v1/login',
    method: 'delete',
  });
}

export function signup(params) {
  return createFetchAction({
    type: 'LOGIN',
    endpoint: '/api/v1/users',
    method: 'post',
    body: params,
    transform: ({ data }) => ({ auth: data }),
  });
}

export function forgotPassword({ email, resetBaseUrl }) {
  return createFetchAction({
    type: 'FORGOT_PASSWORD',
    endpoint: '/api/v1/forgot',
    method: 'post',
    body: { email, resetBaseUrl },
    doDispatch: false,
  });
}

export function resetPassword({ access_token, password }) {
  return createFetchAction({
    type: 'RESET_PASSWORD',
    endpoint: '/api/v1/reset',
    method: 'put',
    body: { access_token, password },
    transform: ({ data }) => ({ auth: data }),
  });
}

export function loadProducts() {
  return createFetchAction({
    type: 'LOAD_PRODUCTS',
    endpoint: '/api/v1/products',
    transform: ({ data }) => normalize(data.products, schemas.products),
    success: {
      pagination: { key: 'products', type: 'REFRESH' },
    },
  });
}

export function loadProduct(id) {
  return createFetchAction({
    type: 'LOAD_PRODUCT',
    endpoint: `/api/v1/products/${id}`,
    transform: ({ data }) => normalize(data, schemas.product),
  });
}

export function searchProducts(query) {
  return createFetchAction({
    type: 'SEARCH_PRODUCTS',
    endpoint: `/api/v1/products/search?${$.param(query)}`,
    doDispatch: false,
  });
}

export function inipay(orderId) {
  return createFetchAction({
    type: 'INIPAY',
    endpoint: `/api/v1/orders/${orderId}/inipay`,
    doDispatch: false,
  });
}

export function loadCart() {
  return createFetchAction({
    type: 'LOAD_CART',
    endpoint: '/api/v1/carts',
  });
}

export function addCartProduct(productVariantId) {
  return createFetchAction({
    type: 'UPDATE_CART',
    endpoint: '/api/v1/carts/product_variants',
    method: 'post',
    body: { productVariantId },
  });
}

export function updateCartProduct(productVariantId, count) {
  return createFetchAction({
    type: 'UPDATE_CART',
    endpoint: '/api/v1/carts/product_variants',
    method: 'put',
    body: { productVariantId, count },
  });
}

export function deleteCartProduct(productVariantId) {
  return createFetchAction({
    type: 'UPDATE_CART',
    endpoint: '/api/v1/carts/product_variants',
    method: 'delete',
    body: { productVariantId },
  });
}

export function createOrder({ productVariants }) {
  return createFetchAction({
    type: 'CREATE_ORDER',
    endpoint: '/api/v1/orders',
    method: 'post',
    body: { productVariants },
    transform: ({ data }) => normalize(data, schemas.order),
  });
}

export function loadOrder(id) {
  return createFetchAction({
    type: 'LOAD_ORDER',
    endpoint: `/api/v1/orders/${id}`,
    transform: ({ data }) => normalize(data, schemas.order),
  });
}

export function loadCategories() {
  return createFetchAction({
    type: 'LOAD_CATEGORIES',
    endpoint: '/api/v1/categories',
  });
}

export function loadAddresses() {
  return (dispatch, getState) => {
    const state = getState();
    if (!state.auth) {
      // TODO alert with message
      window.alert('Not Login User has no address');
      return;
    }
    return createFetchAction({
      type: 'LOAD_ADDRESS',
      endpoint: `/api/v1/users/${state.auth.id}/addresses`,
      transform: ({ data }) => normalize(data.addresses, schemas.addresses),
    }) (dispatch, getState);
  };
}

export function saveAddressAndSetActive(address) {
  return (dispatch, getState) => {
    const state = getState();
    if (!state.auth) {
      // TODO alert with message
      window.alert('Not Login User cannot set address');
      return;
    }
    const headers = {
      'Authorization': state.auth.bearer ? `Bearer ${state.auth.bearer}` : '',
    };
    const ajax = {
      url: `/api/v1/users/${state.auth.id}/addresses`,
      headers,
      processData: false,
      contentType: 'application/json',
    };
    if (address.id) {
      ajax.method = 'PUT';
      ajax.url = `${ajax.url}/${address.id}`;
      ajax.data = JSON.stringify(_.pick(address, 'countryCode', 'detail'));
    } else {
      ajax.method = 'POST';
      ajax.data = JSON.stringify(address);
    }
    $.ajax(ajax).then((data) => {
      dispatch({
        type: 'SET_ACTIVE_ADDRESS',
        addressId: data.id,
      });
    }, () => {
      // TODO
    });
  };
}

export function setActiveAddress(addressId) {
  return (dispatch) => {
    // TODO set in user setting in server
    dispatch({
      type: 'SET_ACTIVE_ADDRESS',
      addressId,
    });
  };
}

export function loadMyOrders() {
  return createFetchAction({
    type: 'LOAD_MY_ORDERS',
    endpoint: state => `/api/v1/users/${state.auth.id}/orders`,
    transform: ({ data }) => normalize(data.orders, schemas.orders),
    success: {
      pagination: { key: 'myOrders', type: 'REFRESH' },
    },
  });
}

export function loadCartIfEmpty() {
  return (dispatch, getState) => {
    const state = getState();
    if (state.auth && state.auth.id && (!state.cart || !state.cart.productVariants)) {
      loadCart()(dispatch, getState);
    }
  };
}

const simpleNotify = (auth, method, url, body) => {
  const headers = {
    'Authorization': auth.bearer ? `Bearer ${auth.bearer}` : '',
  };
  $.ajax({
    url,
    method,
    headers,
    data: JSON.stringify(body),
    processData: false,
    contentType: 'application/json',
  }); // ignore response
};

export function changeLocale(locale) {
  return (dispatch, getState) => {
    const state = getState();
    if (state.activeLocale === locale) return;
    if (state.auth && state.auth.id) {
      simpleNotify(state.auth, 'PUT', `/api/v1/users/${state.auth.id}/locale`, { locale });
    }
    const cookie = require('../utils/cookie');
    cookie.set('locale', locale);
    if (state.i18n && state.i18n[locale]) {
      dispatch({
        type: 'CHANGE_LANGUAGE',
        locale,
      });
    } else {
      return createFetchAction({
        type: 'LOAD_AND_CHANGE_LANGUAGE',
        endpoint: `/api/v1/i18n/texts/${locale}`,
        success: { locale },
      })(dispatch, getState);
    }
  };
}

export function changeCurrency(currency) {
  return (dispatch, getState) => {
    const state = getState();
    if (state.activeCurrency === currency) return;
    if (state.auth && state.auth.id) {
      simpleNotify(state.auth, 'PUT', `/api/v1/users/${state.auth.id}/currency`, { currency });
    }
    const cookie = require('../utils/cookie');
    cookie.set('currency', currency);
    dispatch({
      type: 'CHANGE_CURRENCY',
      currency,
    });
  };
}
