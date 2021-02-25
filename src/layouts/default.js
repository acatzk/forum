import Header from '~/components/Header'

export default function Layout ({ children }) {
  return (
    <div className="flex flex-col antialiased text-gray-900 h-screen">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-5xl px-3">
          { children }
        </div>
      </main>
    </div>
  )
}