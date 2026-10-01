import type { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation() as unknown as {
    state?: { from?: Location; message?: string };
  };
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show success message if redirected from signup
    const message = location.state?.message;
    if (message) {
      setSuccessMessage(message);
      // Clear the message from location state
      navigate('/login', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username.trim(), password.trim());
      const redirectTo =
        (location.state?.from as unknown as { pathname?: string })?.pathname ||
        '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden flex items-center"
      style={{
        background:
          'radial-gradient(ellipse 175.61% 328.84% at 10.42% 76.37%, #34A5E4 0%, #4CB9DF 7%, #51BDDE 15%, #5AC4DC 23%, #73EEE7 30%, #9DF6F1 37%, #CDFFFC 50%, #FFFDFA 57%, #CDFFFC 64%, #9DF6F1 71%, #73EEE7 78%, #9DF6F1 85%, #CDFFFC 100%)',
      }}
    >
      <div className="px-10 py-14 bg-white rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] inline-flex flex-col justify-start items-start gap-8 ml-[154px]">
        <div className="p-2.5 flex flex-col justify-center items-start gap-2.5">
          <div className="text-center justify-start text-indigo-950 text-2xl font-bold font-['Josefin_Sans']">
            Welcome to
          </div>
          <div className="text-center justify-start text-indigo-950 text-5xl font-normal font-['Days_One'] leading-[60px]">
            Karp
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="w-96 py-2.5 flex flex-col justify-start items-start gap-7"
        >
          <div className="self-stretch flex flex-col justify-start items-start gap-[5px]">
            <Label
              htmlFor="username"
              className="self-stretch justify-start text-indigo-950 text-xl font-normal font-['Avenir'] leading-4"
            >
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
              className="self-stretch px-3.5 py-2.5 bg-white rounded-[10px] outline-1 outline-offset-[-1px] outline-zinc-400/50 text-zinc-400 text-lg font-['Avenir'] leading-5 placeholder:text-zinc-400 border-0 focus-visible:ring-0 focus-visible:outline-1 focus-visible:outline-zinc-400/50"
            />
          </div>

          <div className="self-stretch flex flex-col justify-start items-start gap-[5px]">
            <Label
              htmlFor="password"
              className="self-stretch justify-start text-indigo-950 text-xl font-normal font-['Avenir'] leading-4"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="self-stretch px-3.5 py-2.5 bg-white rounded-[10px] outline-1 outline-offset-[-1px] outline-zinc-400/50 text-zinc-400 text-lg font-['Avenir'] leading-5 placeholder:text-zinc-400 border-0 focus-visible:ring-0 focus-visible:outline-1 focus-visible:outline-zinc-400/50"
            />
          </div>

          <div className="w-96 inline-flex justify-between items-center">
            <div className="flex justify-start items-center gap-1.5">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-5 h-5 relative rounded-[3px] border border-gray-200 cursor-pointer"
              />
              <Label
                htmlFor="rememberMe"
                className="justify-center text-zinc-400 text-lg font-['Avenir'] leading-5 cursor-pointer"
              >
                Remember me
              </Label>
            </div>
            <Link
              to="/forgot-password"
              className="justify-center text-indigo-950 text-lg font-extrabold font-['Avenir'] underline leading-5 hover:text-indigo-800"
            >
              Forgot password
            </Link>
          </div>

          {successMessage && (
            <div className="text-karp-green text-sm bg-karp-green/10 border border-karp-green/30 rounded-md p-3 w-full">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="text-karp-orange text-sm bg-karp-orange/10 border border-karp-orange/30 rounded-md p-3 w-full">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-96 h-10 p-2.5 bg-sky-400 rounded-[10px] inline-flex justify-center items-center gap-2.5 hover:bg-sky-500 disabled:opacity-50 text-white text-xl font-extrabold font-['Avenir'] leading-4"
          >
            {loading ? 'Signing in…' : 'Log In'}
          </Button>
        </form>

        <div className="w-96 inline-flex justify-center items-center gap-[5px]">
          <span className="justify-center text-zinc-400 text-lg font-['Avenir'] leading-5">
            Don't have an account?
          </span>
          <Link
            to="/signup/select-type"
            className="justify-center text-indigo-950 text-lg font-extrabold font-['Avenir'] underline leading-5 hover:text-indigo-800"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
