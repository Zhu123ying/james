import App from '../App'

test('renders test heading', () => {
  render(<App />)
  const headingElement = screen.getByText(/hello, world/i)
  expect(headingElement).toBeInTheDocument()
})
