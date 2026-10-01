import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserType } from '@/types/user';
import { Button } from '@/components/ui/button';
import { UsersIcon } from '@/components/icons/UsersIcon';
import { HandbagIcon } from '@/components/icons/HandbagIcon';
import { SignUpSidebar } from '@/components/SignUpSidebar';

const UserTypeSelection = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<UserType | null>(null);

  const handleNext = () => {
    if (selectedType) {
      navigate('/signup/details', { state: { userType: selectedType } });
    }
  };

  return (
    <div className="min-h-screen bg-karp-background flex">
      {/* Left Column - Progress Indicator */}
      <SignUpSidebar currentStep={1} backTo="/login" />

      {/* Right Column - Selection */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-karp-font mb-2">
            Are you an Organization or Vendor?
          </h1>
          <p className="text-lg text-karp-font mb-8">
            Please select a user type.
          </p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Organization Card */}
            <button
              type="button"
              onClick={() => setSelectedType('ORGANIZATION')}
              className={`p-8 bg-white rounded-lg border-2 transition-all hover:shadow-lg ${
                selectedType === 'ORGANIZATION'
                  ? 'border-karp-primary shadow-md'
                  : 'border-karp-font/20'
              }`}
            >
              <div className="flex flex-col items-center space-y-4">
                <div
                  className={`${
                    selectedType === 'ORGANIZATION'
                      ? 'text-karp-primary'
                      : 'text-karp-font'
                  }`}
                >
                  <UsersIcon />
                </div>
                <span className="text-lg font-medium text-karp-font">
                  Organization
                </span>
              </div>
            </button>

            {/* Vendor Card */}
            <button
              type="button"
              onClick={() => setSelectedType('VENDOR')}
              className={`p-8 bg-white rounded-lg border-2 transition-all hover:shadow-lg ${
                selectedType === 'VENDOR'
                  ? 'border-karp-primary shadow-md'
                  : 'border-karp-font/20'
              }`}
            >
              <div className="flex flex-col items-center space-y-4">
                <div
                  className={`${
                    selectedType === 'VENDOR'
                      ? 'text-karp-primary'
                      : 'text-karp-font'
                  }`}
                >
                  <HandbagIcon />
                </div>
                <span className="text-lg font-medium text-karp-font">
                  Vendor
                </span>
              </div>
            </button>
          </div>

          <Button
            onClick={handleNext}
            disabled={!selectedType}
            className={`w-full ${
              selectedType
                ? 'bg-karp-orange text-white hover:bg-karp-orange/90'
                : 'bg-white border border-karp-orange/30 text-karp-font opacity-50 cursor-not-allowed'
            }`}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;
