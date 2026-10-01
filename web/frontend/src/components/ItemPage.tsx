import type { Item } from '@/types/item';
import { useAuth } from '@/context/AuthContext';

interface ItemPageProps {
  item: Item | null;
}

export function ItemPage({ item }: ItemPageProps) {
  const { user } = useAuth();
  const isAdmin = user?.user_type === 'ADMIN';
  if (!item) {
    return (
      <div className="p-6 text-center text-gray-500">
        No item data available.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 -mt-15">
      <div className="mx-auto max-w-3xl p-6 space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold">{item.name}</h1>
          <p className="text-gray-500">{item.status}</p>

          <div className="mt-4 space-y-4">
            <div>
              <h2 className="font-semibold">Dollar Cost</h2>
              <p>{isAdmin ? `${item.price} coins` : `$${item.price / 100}`}</p>
            </div>

            <div>
              <h2 className="font-semibold">Time Posted → Expiration Date</h2>
              <p>
                {new Date(item.time_posted).toLocaleString()} →{' '}
                {new Date(item.expiration).toLocaleString()}
              </p>
            </div>

            {item.description && (
              <div>
                <h2 className="font-semibold">Description</h2>
                <p>{item.description}</p>
              </div>
            )}

            {/* Do we want to display keywords if we are only generating keywords for the purposes of displaying items in the shop? */}
            {/* {item.keywords && (
                <div>
                <h2 className="font-semibold">Keywords</h2>
                <div className="flex flex-wrap gap-2 mt-1">
                    {item.keywords.map(k => (
                    <span
                        key={k}
                        className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm"
                    >
                        {k}
                    </span>
                    ))}
                </div>
                </div>
            )} */}

            {item.qr_code_image && (
              <div className="flex gap-4 mt-4">
                QR Code
                <img
                  src={`data:image/png;base64,${item.qr_code_image}`}
                  alt="QR Code"
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
