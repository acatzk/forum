import Post from './Post'

export default function PostList ({ posts: postProps, actions: actionProps, ...props }) {
  if (!postProps) return null

  const [firstPost, ...posts] = postProps
  const {handleDelete, ...actions} = actionProps

  return (
    <div className="py-2 divide-y">
      <Post {...firstPost} {...props} actions={actions} />
      { posts.map((p) => <Post key={p.id} {...p} {...props} actions={{ ...actions, handleDelete }} />) }
    </div>
  )
}