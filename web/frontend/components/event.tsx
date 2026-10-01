import React from 'react';

interface EventProps {
  name?: string;
  location?: string;
  startDateTime?: string;
  endDateTime?: string;
  status?: string;
  maxVolunteers?: string;
  spotsLeft?: string;
  id?: string;
}

function Event({
  name = 'Event',
  location = 'TBD',
  startDateTime = 'TBD',
  endDateTime = 'TBD',
  status = 'upcoming',
  maxVolunteers = 'No limit',
  spotsLeft = 'Unlimited',
  id,
}: EventProps) {
  return (
    <div className="event" data-id={id}>
      <h3>{name}</h3>
      <div className="event-details">
        <p>
          <strong>Location:</strong> {location}
        </p>
        <p>
          <strong>Start:</strong> {startDateTime}
        </p>
        <p>
          <strong>End:</strong> {endDateTime}
        </p>
        <p>
          <strong>Status:</strong> <span className="status">{status}</span>
        </p>
        <p>
          <strong>Max Volunteers:</strong> {maxVolunteers}
        </p>
        <p>
          <strong>Spots Left:</strong>{' '}
          <span className="spots-left">{spotsLeft}</span>
        </p>
      </div>
    </div>
  );
}

export default Event;
