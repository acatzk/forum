import Category from './Category'

export default function CategoryList ({ categories }) {
  if (!categories) return null

  return (
    <div className="py-2 w-full">
      { categories.map(Category) }
    </div>
  )
}