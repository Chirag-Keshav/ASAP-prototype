import { SignupForm } from '@/components/auth/SignupForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf } from 'lucide-react';

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
       <div className="flex items-center gap-2 mb-4 text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="M5 18a4 4 0 0 1-4-4 4 4 0 0 1 4-4h1c.28 0 .55.03.81.08"/><path d="M19 6a4 4 0 0 1 4 4 4 4 0 0 1-4 4h-1c-.28 0-.55-.03-.81-.08"/><path d="M10.2 20.8a2 2 0 0 0 3.6 0"/><path d="M7 10h10"/><path d="m9 10 1.95-3.46a2.05 2.05 0 0 1 3.61 1.93L13 10l-1.95 3.46a2.05 2.05 0 0 1-3.61-1.93L9 10Z"/></svg>
        <h1 className="text-4xl font-headline font-bold text-primary">ASAP</h1>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>Join our student delivery network.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </main>
  );
}
