import { useEffect } from 'react'

const Page = ({ children, title }) => {
  useEffect(() => {
    document.title = title || ''
  }, [title])

  return children
}

export default Page
