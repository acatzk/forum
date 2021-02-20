import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'

export default function PerfectScroll ({ chilren}) {
  return (
    <PerfectScrollbar>
      <div className="container mx-auto max-w-5xl px-3">
        { chilren }
      </div>
    </PerfectScrollbar>
  )
}