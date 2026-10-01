import type { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { UserType } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SignUpSidebar } from '@/components/SignUpSidebar';

const VENDOR_INDUSTRIES = [
  'Food & Sweets',
  'Flowers & Plants',
  'Jewelry & Accessories',
  'Toys & Kids Gifts',
  'Home & Lifestyle',
  'Wellness & Self-Care',
  'Tech & Gadgets',
  'Local / Artisan',
] as const;

const ORGANIZATION_TYPES = [
  'Nonprofit',
  'Education',
  'Youth Services',
  'Senior Services',
  'Shelter / Housing',
  'Food Assistance',
  'Animal Services',
  'Environmental',
  'Healthcare',
  'Religious',
  'Arts & Culture',
  'Government Program',
] as const;

const SignUpDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state as {
    userType?: UserType;
  };

  const [industryType, setIndustryType] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to account type selection if no user type is provided
    if (!formData?.userType) {
      navigate('/signup/select-type', { replace: true });
    }
  }, [formData, navigate]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!formData.userType) {
      setError('User type is required');
      return;
    }

    // Navigate to signup page with details data
    navigate('/signup', {
      state: {
        userType: formData.userType,
        industryType: industryType.trim(),
        description: description.trim(),
        address: address.trim(),
        website: website?.trim(),
      },
    });
  }

  const isVendor = formData?.userType === 'VENDOR';
  const industryOptions = isVendor ? VENDOR_INDUSTRIES : ORGANIZATION_TYPES;
  const pageTitle = isVendor
    ? "Let's get to know more about your vendor"
    : "Let's get to know more about your organization";

  return (
    <div className="min-h-screen bg-karp-background flex">
      {/* Left Column - Progress Indicator */}
      <SignUpSidebar currentStep={2} backTo="/signup/select-type" />

      {/* Right Column - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-karp-font mb-8">
            {pageTitle}
          </h1>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="industryType" className="text-karp-font">
                Select your {isVendor ? 'industry type' : 'organization type'}
              </Label>
              <select
                id="industryType"
                value={industryType}
                onChange={e => setIndustryType(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-karp-font/20 rounded-md text-karp-font focus:outline-none focus:ring-2 focus:ring-karp-primary focus:border-karp-primary"
              >
                <option value="">
                  {isVendor ? 'Industry Type' : 'Organization Type'}
                </option>
                {industryOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-karp-font">
                Give a short description about your{' '}
                {isVendor ? 'company' : 'organization'}.
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                placeholder="Summarize here."
                rows={4}
                className="bg-white border-karp-font/20 text-karp-font"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-karp-font">
                Address
              </Label>
              <Input
                id="address"
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
                placeholder="Address here"
                className="bg-white border-karp-font/20 text-karp-font"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-karp-font">
                Website (optional)
              </Label>
              <Input
                id="email"
                type="url"
                value={website || ''}
                onChange={e => setWebsite(e.target.value)}
                placeholder="Enter your website (optional)."
                className="bg-white border-karp-font/20 text-karp-font"
              />
            </div>

            {error && (
              <div className="text-karp-orange text-sm bg-karp-orange/10 border border-karp-orange/30 rounded-md p-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="outline"
              className="w-full border-karp-orange/30 bg-white text-karp-font hover:bg-karp-font/5"
            >
              Next
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpDetails;
