import Navbar from '../components/Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 lg:px-8 py-5 sm:py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}

