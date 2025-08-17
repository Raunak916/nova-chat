import { useSignInEmailPassword, useAuthenticationStatus } from '@nhost/react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import nhost from '../lib/nhost';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import { Sun, Moon } from 'lucide-react';

export default function LoginPage() {
  const {theme , setTheme} = useTheme();
  const { signInEmailPassword, isLoading, error } = useSignInEmailPassword();
  const { isAuthenticated } = useAuthenticationStatus();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Show a toast notification only when the error state changes
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();
    await signInEmailPassword({ email, password });
  };

  const handleGoogleSignIn = async () => {
    await nhost.auth.signIn({ provider: 'google' });
  };

  return (
    <div className="relative flex h-screen bg-cover bg-center"
    style={{
    backgroundImage: "url('/solar-bg.jpg')", // full-page bg
     }}
    >

      {/* Left side with background image */}
      <div className="hidden lg:flex w-1/2 bg-background/60 transition-all duration-500 ease-in-out">
        <div className='absolute top-5 left-5 flex flex-col '>
          <div className=' flex items-center space-x-2 '>
           <img src="/nova-lightLogo.svg" className="w-10 h-10" />
           <span className='font-bold text-lg font-special-gothic text-white'>NOVA chat</span>
          </div>
          <div className>
            <span className='font-bold text-lg font-special-gothic text-muted-foreground'>Your AI Chat Companion</span>
          </div>
        </div>
      </div>

      {/* Right side with login form */}
       <div className="flex w-full lg:w-1/2 justify-center items-center bg-background/60 backdrop-blur-md px-4 transition-all duration-500 ease-in-out">
        <Card 
          className="w-full max-w-md shadow-xl border-0 rounded-2xl font-mono"
          style={{ background: 'color-mix(in srgb, var(--card) 75%, transparent)' }}>
          <CardHeader className='relative'>
            {/* Logo for mobile top  */}
          <div className="flex flex-col items-center mb-4 lg:hidden">
            <img src="/nova-lightLogo.svg" className="w-12 h-12" />
            <span className="font-bold text-xl font-special-gothic">NOVA chat</span>
            <span className="text-sm text-muted-foreground">Your AI Chat Companion</span>
          </div>
            <Button 
             onClick={()=>(setTheme(theme === 'light' ? "dark" : "light"))}
             className='absolute top-2 right-2 p-2 rounded-md hover:bg-muted transition hover:text-muted-foreground'
             >
              {theme === "light" ? 
                 <Moon className="w-5 h-5 " /> : 
                 <Sun className="w-5 h-5" />}
            </Button>
            <CardTitle className="text-3xl font-bold">
              Welcome, login to your account
            </CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className='font-mono'>Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='dark:bg-muted-foreground/85 font-mono '
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className='font-mono'>Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder='password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='dark:bg-muted-foreground/85 font-mono'
                />
              </div>
              <Button type="submit" 
              variant={"outline"}
              onClick={handleLogin} 
              className="w-full flex items-center justify-center font-mono bg-black text-white hover:bg-muted hover:text-foreground" 
              disabled={isLoading}>
                {isLoading ? "Logging in..." : "Sign in"}
              </Button>
              <Button
                variant="outline"
                type="button"
                className="w-full flex items-center justify-center font-mono bg-black text-white hover:bg-muted hover:text-foreground"
                onClick={handleGoogleSignIn}
              >
                <img
                  className="w-4 h-4 mr-2"
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google logo"
                />
                Sign in with Google
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              New User?{" "}
              <Link to="/signup" className="underline">
                Sign Up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
   
}


/*
this is how the response of usesigninemailpassword looks like
{
  "isSuccess": true,
  "isError": false,
  "error": null,
  "user": {
    "id": "abc123",
    "email": "test@example.com"
  },
  "session": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "abcd...",
    "expiresIn": 900
  }
}
*/ 