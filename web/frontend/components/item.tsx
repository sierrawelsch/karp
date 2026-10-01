import React from 'react';

interface ItemProps {
  name?: string;
  price?: string;
  status?: string;
  timePosted?: string;
  expirationTimestamp?: string;
  id?: string;
}

function Item({
  name = 'Item',
  price = '$0.00',
  status = 'available',
  timePosted = 'Just now',
  expirationTimestamp = 'No expiration',
  id,
}: ItemProps) {
  return (
    <div className="item" data-id={id}>
      <h3>{name}</h3>
      <div className="item-details">
        <p>
          <strong>Price:</strong> {price}
        </p>
        <p>
          <strong>Status:</strong> <span className="status">{status}</span>
        </p>
        <p>
          <strong>Posted:</strong> {timePosted}
        </p>
        <p>
          <strong>Expires:</strong> {expirationTimestamp}
        </p>
      </div>
    </div>
  );
}

export default Item;
