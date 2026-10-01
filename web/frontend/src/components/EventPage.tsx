import type { Event } from '@/types/event';

interface EventPageProps {
  event: Event | null;
}

export function EventPage({ event }: EventPageProps) {
  if (!event) {
    return (
      <div className="p-6 text-center text-gray-500">
        No event data available.
      </div>
    );
  }
  console.log(event);
  return (
    <div className="min-h-screen p-6 bg-gray-50 -mt-15">
      <div className="mx-auto max-w-3xl p-6 space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold">{event.name}</h1>
          <p className="text-gray-500">{event.status}</p>

          <div className="mt-4 space-y-4">
            <div>
              <h2 className="font-semibold">Location</h2>
              <p>{event.address}</p>
            </div>

            <div>
              <h2 className="font-semibold">Date & Time</h2>
              <p>
                {new Date(event.start_date_time).toLocaleString()} →{' '}
                {new Date(event.end_date_time).toLocaleString()}
              </p>
            </div>

            {event.description && (
              <div>
                <h2 className="font-semibold">Description</h2>
                <p>{event.description}</p>
              </div>
            )}

            <div>
              <h2 className="font-semibold underline">Additional Details</h2>
              <ul className="space-y-1 mt-3">
                <li>
                  <strong>Max Volunteers:</strong> {event.max_volunteers}
                </li>
                <li>
                  <strong>Coins:</strong> {event.coins}
                </li>
                {event.age_min !== null && event.age_max !== null && (
                  <li>
                    <strong>Age Range:</strong> {event.age_min}–{event.age_max}
                  </li>
                )}
              </ul>
            </div>

            {event.keywords && (
              <div>
                <h2 className="font-semibold">Keywords</h2>
                <div className="flex flex-wrap gap-2 mt-1">
                  {event.keywords?.map(k => (
                    <span
                      key={k}
                      className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {event.check_in_qr_code_image && event.check_out_qr_code_image && (
              <div className="flex gap-4 mt-4">
                Check-In QR Code
                <img
                  src={`data:image/png;base64,${event.check_in_qr_code_image}`}
                  alt="Check-in QR Code"
                  className="w-32 h-32"
                />
                Check-Out QR Code
                <img
                  src={`data:image/png;base64,${event.check_out_qr_code_image}`}
                  alt="Check-out QR Code"
                  className="w-32 h-32"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
