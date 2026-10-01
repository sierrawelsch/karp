import type { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { UserType } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignUpSidebar } from '@/components/SignUpSidebar';
import { signupApi } from '@/api/auth';
import { useAuth } from '@/context/AuthContext';
import { createVendor } from '@/api/vendor';
import { createOrganization } from '@/api/organization';
import { uploadImage } from '@/api/utils/image';

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const formData = location.state as {
    userType?: UserType;
    industryType?: string;
    description?: string;
    address?: string;
    website?: string;
  };

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [orgImageFile, setOrgImageFile] = useState<File | null>(null);

  useEffect(() => {
    // Redirect to account type selection if no user type is provided
    if (!formData?.userType) {
      navigate('/signup/select-type', { replace: true });
    }
  }, [formData, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.userType) {
        setError('User type is required');
        setLoading(false);
        return;
      }

      // Validate passwords match
      if (password.trim() !== confirmPassword.trim()) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      // Create the user account
      await signupApi({
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        user_type: formData.userType,
      });

      // Automatically sign in the user with the credentials they used to sign up
      try {
        await login(username.trim(), password.trim());

        // Create vendor/organization profile after successful login
        // (industryType, description, address) are saved in a separate API call
        if (formData.userType === 'VENDOR' && formData.industryType) {
          try {
            if (!formData.address) {
              console.error('Vendor address missing during creation');
            } else {
              await createVendor({
                name: `${firstName.trim()} ${lastName.trim()}`,
                business_type: formData.industryType,
                address: formData.address,
              });
            }
          } catch (profileError) {
            console.error('Failed to create vendor profile:', profileError);
            // Continue even if profile creation fails - user can create it later
          }
        } else if (
          formData.userType === 'ORGANIZATION' &&
          formData.description &&
          formData.address
        ) {
          try {
            const newOrganization = await createOrganization({
              name: `${firstName.trim()} ${lastName.trim()}`,
              description: formData.description,
              address: formData.address,
              website: formData.website?.trim() || undefined,
            });
            if (orgImageFile) {
              try {
                await uploadImage(
                  'organization',
                  newOrganization.id,
                  orgImageFile
                );
              } catch (uploadErr) {
                console.error(
                  'Failed to upload organization image:',
                  uploadErr
                );
              }
            }
          } catch (profileError) {
            console.error(
              'Failed to create organization profile:',
              profileError
            );
            // Continue even if profile creation fails - user can create it later
          }
        }

        // Redirect to home page on successful login
        navigate('/', { replace: true });
      } catch (loginError) {
        // If auto-login fails, redirect to login page with a message
        const error = loginError as Error;
        navigate('/login', {
          replace: true,
          state: {
            message: 'Account created successfully! Please log in.',
            error: error.message || 'Auto-login failed',
          },
        });
      }
    } catch (err) {
      const error = err as Error;
      let errorMessage = 'Sign up failed';
      if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-karp-background flex">
      {/* Left Column - Progress Indicator */}
      <SignUpSidebar currentStep={3} backTo="/signup/details" />

      {/* Right Column - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-karp-font mb-8">
            Let's set up your account
          </h1>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-karp-font">
                First name
              </Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                placeholder="Enter your first name."
                className="bg-white border-karp-font/20 text-karp-font"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-karp-font">
                Last name
              </Label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                placeholder="Enter your last name."
                className="bg-white border-karp-font/20 text-karp-font"
              />
            </div>

            {formData?.userType === 'ORGANIZATION' && (
              <div className="space-y-2">
                <Label htmlFor="orgImage" className="text-karp-font">
                  Organization image (optional)
                </Label>
                <Input
                  id="orgImage"
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0] || null;
                    setOrgImageFile(file);
                  }}
                  className="bg-white border-karp-font/20 text-karp-font"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-karp-font">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="Enter your username."
                className="bg-white border-karp-font/20 text-karp-font"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-karp-font">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Enter your company email address."
                className="bg-white border-karp-font/20 text-karp-font"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-karp-font">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Enter a password."
                className="bg-white border-karp-font/20 text-karp-font"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-karp-font">
                Re-enter Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                placeholder="Reenter your password."
                className="bg-white border-karp-font/20 text-karp-font"
              />
              {confirmPassword &&
                password !== confirmPassword &&
                confirmPassword.length > 0 && (
                  <p className="text-sm text-karp-orange">
                    Passwords do not match
                  </p>
                )}
            </div>

            {error && (
              <div className="text-karp-orange text-sm bg-karp-orange/10 border border-karp-orange/30 rounded-md p-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              variant="outline"
              className="w-full border-karp-orange/30 bg-white text-karp-font hover:bg-karp-font/5"
            >
              {loading ? 'Processing…' : 'Next'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
