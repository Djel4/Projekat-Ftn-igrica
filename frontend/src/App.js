import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreens from './screens/HomeScreens'
import { Container } from 'react-bootstrap'


const App = () => {
  return (
  <>
  <Header />
  <main className="py-3">
     <Container>
   <HomeScreens>
   </HomeScreens>
    <p>Please proceed to login or sing in</p>

    </Container>
  </main>
 <Footer />
  </>     
  )
  

}
export default App
