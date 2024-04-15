import { PostCard } from '@/components/post-card'
import type { NextPage } from 'next'

const mockData = {
  author: { id: 'a', name: 'TIesen', avatar: 'https://source.unsplash.com/random' },
  content:
    'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
  image: 'https://source.unsplash.com/random',
  createdAt: '2021-10-10T10:00:00Z',
  heartCount: 10,
  replyCount: 5,
}

const Page: NextPage = () => {
  return (
    <ul>
      {[...Array(10).fill(mockData)].map((data, idx) => (
        <li key={idx}>
          <PostCard post={data} />
        </li>
      ))}
    </ul>
  )
}

export default Page
