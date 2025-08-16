import { useSignUpEmailPassword, useAuthenticationStatus } from '@nhost/react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import { Moon, Sun } from 'lucide-react';
import nhost from '@/lib/nhost';

export default function SignupPage() {
  const {theme , setTheme} = useTheme();
  const { signUpEmailPassword, isLoading, isSuccess, error } = useSignUpEmailPassword();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthenticationStatus();

  //redirect if the user is already authenticatd..
  useEffect(()=>{
    if(isAuthenticated){
      navigate('/chat', { replace: true });
    }
  },[isAuthenticated, navigate])

  // Show a toast notification when an error occurs
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  // Show a success message and redirect on successful signup
  useEffect(() => {
    if (isSuccess) {
      toast.success("Signup successful! Please login.");
      navigate('/login');
    }
  }, [isSuccess, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    await signUpEmailPassword({ email: email.trim(), password });
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
      <div className=" w-full lg:w-1/2 bg-background/60 ">
        <div className='absolute top-5 left-5 flex flex-col '>
          <div className=' flex items-center space-x-2 '>
           <img src="/nova-lightLogo.svg" className="w-10 h-10" />
           <span className='font-bold text-lg font-special-gothic text-white'>NOVA chat</span>
          </div>
          <div>
            <span className='font-bold text-lg font-special-gothic text-muted-foreground'>Your AI Chat Companion</span>
          </div>
        </div>
      </div>

      {/* Right side with login form */}
       <div className="ml-auto flex w-full lg:w-1/2 justify-center items-center bg-background/60 backdrop-blur-md">
        <Card 
          className="w-full max-w-md shadow-xl border-0 rounded-2xl font-mono"
          style={{ background: 'color-mix(in srgb, var(--card) 75%, transparent)' }}>
          <CardHeader className='relative'>
            <Button 
             onClick={()=>(setTheme(theme === 'light' ? "dark" : "light"))}
             className='absolute top-2 right-2 p-2 rounded-md hover:bg-muted transition hover:text-muted-foreground'
             >
              {theme === "light" ? 
                 <Moon className="w-5 h-5 " /> : 
                 <Sun className="w-5 h-5" />}
            </Button>
            <CardTitle className="text-3xl font-bold">
              Welcome, SignUp to use Nova Chat
            </CardTitle>
            <CardDescription>
              Enter your SignUp details below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="grid gap-4">
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
              onClick={handleSignup} 
              className="w-full flex items-center justify-center font-mono bg-black text-white hover:bg-muted hover:text-foreground" 
              disabled={isLoading}>
                {isLoading ? "Logging in..." : "Sign in"}
              </Button>
              <Button
              variant={"outline"}
              type='button'
              className="w-full flex items-center justify-center font-mono bg-black text-white hover:bg-muted hover:text-foreground"
              onClick={handleGoogleSignIn}
              >

                <img className="w-4 h-4 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" />
                Sign Up with Google
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
   
}

/* 

this is how the response from signupemailpassword looks like 
{
  "isSuccess": true,
  "isError": false,
  "error": null,
  "needsEmailVerification": true,
  "user": {
    "id": "abc123",
    "email": "test@example.com"
  }
}
*/