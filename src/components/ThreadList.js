import Thread from './Thead'

export default function ThreadList ({ threads }) {
  if (!threads) return null

  return (
    <div className="py-2 w-full divide-y">
      { threads.map(Thread) }
    </div>
  )
}