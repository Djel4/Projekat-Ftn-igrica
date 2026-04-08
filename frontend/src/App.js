import react from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { Container } from 'react-bootstrap'


const App = () => {
  return (
  <>
  <Header />
  <main className="py-3">
     <Container>
    <h1>Welcome to Hospinia online Web Game</h1>
    <p>Please continue to login or sing in</p>

    </Container>
  </main>
 <Footer />
  </>     
  )
  

}
export default App
