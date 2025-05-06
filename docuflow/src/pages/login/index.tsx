import{ useState, useEffect, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, FileText } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navigate } from 'react-router-dom';

export default function Login() {
    const { userData, login } = useAuthContext()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (userData) {
        return <Navigate to="/"/>
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-50 to-teal-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="h-16 w-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="h-8 w-8 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to DocFlow</h2>
          <p className="text-gray-600 mb-6">
            Your electronic document management system for creating, reviewing, signing, and archiving important documents.
          </p>
          <div className="flex flex-col space-y-4">
          <Label htmlFor='email'>Email</Label>
          <Input name="email" type="email" required onChange={(e) => setEmail(e.target.value)} />
          <Label htmlFor='email'>Password</Label>
          <Input name="password" type="password" onChange={(e) => setPassword(e.target.value)}/>

          <Button 
            onClick={() => login(email, password)} 
            className="bg-teal-600 hover:bg-teal-700 flex items-center justify-center w-full"
            size="lg"
          >
            <LogIn className="h-5 w-5 mr-2" />
            Sign in to continue
          </Button>
          </div>
        </div>
      </div>
    );
}