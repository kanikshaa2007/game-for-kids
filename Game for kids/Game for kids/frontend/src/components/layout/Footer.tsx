'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="font-bold font-heading text-gray-700">
              Kids Learning Platform
            </span>
          </div>

          <p className="text-gray-500 text-sm text-center">
            Made with ❤️ for curious minds everywhere
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>© 2024</span>
            <span>Safe & Educational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
