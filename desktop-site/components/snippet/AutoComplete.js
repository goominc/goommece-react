// Copyright (C) 2016 Goom Inc. All rights reserved.

import React, { PropTypes } from 'react';

export default React.createClass({
  propTypes: {
    boxClassName: PropTypes.string,
    items: PropTypes.array,
    onChangeText: PropTypes.func,
    onSelectItem: PropTypes.func,
    placeholder: PropTypes.string,
    text: PropTypes.string,
  },
  render() {
    const { items, boxClassName, placeholder, onSelectItem, text, onChangeText } = this.props;
    const renderItem = (item) => (
      <div key={item.text} className="dropdown-item" onClick={() => onSelectItem(item)}>
        {item.text}
      </div>
    );
    const renderDropdown = () => {
      if (items && items.length > 0) {
        return (
          <div className="dropdown-box open">
            {items.map((item) => renderItem(item))}
          </div>
        );
      }
      return (<div></div>);
    };
    return (
      <div className={boxClassName}>
        <input type="text"
          placeholder={placeholder}
          defaultValue={text}
          onChange={(e) => onChangeText(e.target.value)}
        />
        {renderDropdown()}
      </div>
    );
  },
});
