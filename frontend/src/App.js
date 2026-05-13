import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreens from './screens/HomeScreens'
import { Container, Col, Row } from 'react-bootstrap'


const App = () => {
  return (
  <>
  <Header />
  <main className="py-3">
     <Container>
   <HomeScreens>
   </HomeScreens>
   <Row>
    <Col className='text-center py-5'>
      <p >Please proceed to login or sing in</p>
    </Col>
   </Row>
    

    </Container>
  </main>
 <Footer />
  </>     
  )
  

}
export default App
