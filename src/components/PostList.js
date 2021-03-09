import Post from './Post'

export default function PostList ({ posts, ...props }) {
  if (!posts) return null

  return (
    <div className="py-2 divide-y">
      { posts.map((p) => <Post key={p.id} {...p} {...props} />) }
    </div>
  )
}