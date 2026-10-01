import { Link } from 'react-router-dom';
import { BuildingsIcon } from './icons/BuildingsIcon';
import { UserIcon } from './icons/UserIcon';
import { FishIcon } from './icons/FishIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

type SignUpStep = 1 | 2 | 3 | 4;

type SignUpSidebarProps = {
  currentStep: SignUpStep;
  backTo?: string;
};

export const SignUpSidebar = ({
  currentStep,
  backTo = '/login',
}: SignUpSidebarProps) => {
  const steps = [
    {
      number: 1,
      title: 'Select Business Type',
      icon: BuildingsIcon,
    },
    {
      number: 2,
      title: 'Business Details',
      icon: UserIcon,
    },
    {
      number: 3,
      title: 'Your Details',
      icon: UserIcon,
    },
    {
      number: 4,
      title: 'Welcome to Karp!',
      icon: FishIcon,
    },
  ];

  return (
    <div className="w-1/4 bg-karp-background p-6 border-r border-karp-font/10 flex flex-col">
      <Link
        to={backTo}
        className="inline-flex items-center text-karp-font hover:text-karp-primary mb-8"
      >
        <ChevronLeftIcon />
      </Link>

      <div className="flex-1 flex items-start pt-[20vh]">
        <div className="space-y-2 w-full">
          {steps.map((step, index) => {
            const isActive = step.number === currentStep;
            const isCompleted = step.number < currentStep;
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.number} className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center ${
                      isActive
                        ? 'border-karp-primary bg-karp-primary'
                        : isCompleted
                          ? 'border-karp-primary/50 bg-karp-primary/5'
                          : 'border-gray-300 bg-white'
                    }`}
                  >
                    <Icon
                      className={
                        isActive
                          ? 'text-white'
                          : isCompleted
                            ? 'text-karp-primary/70'
                            : 'text-gray-400'
                      }
                    />
                  </div>
                  {!isLast && (
                    <div
                      className={`w-0.5 h-8 border-l-2 border-dotted mt-2 ${
                        isCompleted || isActive
                          ? 'border-karp-primary/30'
                          : 'border-gray-300'
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 pt-2.5">
                  <h3
                    className={`font-bold text-lg ${
                      isActive
                        ? 'text-karp-font'
                        : isCompleted
                          ? 'text-karp-font/70'
                          : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
