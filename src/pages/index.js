import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Forum</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1 className="text-2xl font-semibold text-gray-700">Hello world</h1>
      </div>
    </>
  )
}
