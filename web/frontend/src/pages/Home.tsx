// import { useAdmins } from '@/hooks/useAdmins';

const Home = () => {
  // const { data: admins, isLoading, error } = useAdmins();

  return (
    <div className="p-4">
      <div className="sticky top-[48px] z-30 -mx-4 px-4 py-3 bg-karp-background/95 supports-[backdrop-filter]:bg-karp-background/80 backdrop-blur border-b border-karp-font/10">
        <div className="mx-auto w-full min-w-[1100px]">
          <h1 className="text-4xl font-bold text-karp-font text-center">
            Welcome to Karp
          </h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        {/* {isLoading && (
          <div className="text-center py-8 text-karp-font/70">
            Loading admins...
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-karp-orange">
            Error loading admins
          </div>
        )}

        {admins && admins.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-karp-font mb-4">
              Administrators
            </h2>
            <div className="grid gap-4">
              {admins.map(admin => (
                <div
                  key={admin.id}
                  className="bg-karp-background border border-karp-font/20 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-karp-primary/50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-karp-font">
                        {admin.first_name} {admin.last_name}
                      </h3>
                      <p className="text-karp-font/70">{admin.email}</p>
                      <p className="text-karp-font/70">{admin.phone}</p>
                      <p className="text-sm text-karp-font/60 mt-2">
                        Role: {admin.role}
                      </p>
                      {admin.permissions && admin.permissions.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-karp-font/80">
                            Permissions:
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {admin.permissions.map((permission, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-karp-primary/20 text-karp-primary rounded text-xs"
                              >
                                {permission}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-karp-font/60">
                        Created:{' '}
                        {new Date(admin.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {admins && admins.length === 0 && (
          <div className="text-center py-8 text-karp-font/70">
            No admins found.
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Home;
