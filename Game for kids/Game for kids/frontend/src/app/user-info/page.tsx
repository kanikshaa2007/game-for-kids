'use client';

import { useRouter } from 'next/navigation';

export default function UserInfoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-br from-yellow-300 via-orange-300 to-red-300">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-white mb-4">✏️ Profile Setup</h1>
        <p className="text-white mb-8">
          This step is included in the login process. Go back to continue!
        </p>
        <button
          onClick={() => router.push('/login')}
          className="px-8 py-3 bg-white text-orange-500 font-bold rounded-2xl hover:shadow-lg transition-all"
        >
          Go to Login →
        </button>
      </div>
    </div>
  );
}
