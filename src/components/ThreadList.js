import Thread from './Thead'

export default function ThreadList ({ threads }) {
  if (!threads) return null

  return (
    <div className="py-6">
      { threads.map(Thread) }
    </div>
  )
}