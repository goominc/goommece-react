// Copyright (C) 2016 Goom Inc. All rights reserved.

import React, { PropTypes } from 'react';

import UserTerms from 'commons/components/user/UserTerms';

export default React.createClass({
  contextTypes: {
    router: PropTypes.object.isRequired,
  },
  componentDidMount() {
    $('body').scrollTop(0);
  },
  render() {
    const onClick = () => {
      this.context.router.goBack();
    };
    return (
      <div className="policies-container">
        <UserTerms />
        <div className="signin-button button-confirm" onClick={onClick}>확인</div>
      </div>
    );
  },
});
