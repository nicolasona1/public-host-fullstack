import { useState, useEffect} from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Navbar from './Navbar/Navbar'
import './App.css'
import Welcome from './Welcome/Welcome'
import Signup from './AuthRoutes/Signup'
import Login from './AuthRoutes/Login'
import CardDashboard from './CreditCard/CardDashboard'
import CardForm from './CreditCard/CardForm'
import Toast from './Toast/Toast'
import Navbar2 from './Navbar/Navbar2'
function App() {
  //const [users, setUsers] = useState([])
  const [cards, setCards] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentCard, setCurrentCard] = useState({})
  const [screen, setScreen] = useState('welcome')
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState('success');
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();
  const showToast = (message, type = 'success') => {
    setToastVisible(false)
    setTimeout(() => {
      setToastMessage(message);
      setToastType(type);
      setToastVisible(true);
    }, 10);
  };  
  useEffect(() => {
    if (!currentUser) return;       // only fetch once logged in
    fetchCards();
  }, [currentUser]);

  const fetchCards = async() => {
    if (!currentUser) return; 
    try{
      const response = await fetch("/api/user_cards", {
        credentials: "include"
      });
      
      if (response.ok) {
        const data = await response.json()
        setCards(data.cards)
        console.log(data.cards)
      } else {
        console.log("Error fetching cards:", response.status)
        setCards([])
      }
    } catch (error) {
      console.log("Error fetching users:", error)
      setCards([])
    }
  }
  

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentCard({})
  }
  

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true)
  }

  const openEditModal = (card) => {
    if (isModalOpen) return 
    setCurrentCard(card)
    setIsModalOpen(true)
  }

  const onUpdate = () => {
    closeModal()
    fetchCards()
  }

  // if (screen === 'welcome'){
  //   return (
  //     <>
  //     <Navbar
  //     onLoginClick={() => setScreen("login")}
  //     onSignupClick={() => setScreen("signup")}
  //     />
  //     <Welcome onGetStarted={() => setScreen("auth")}/>
  //     </>
  //   )
  // }
  // if (screen === 'signup'){
  //   return(
  //   <>
  //     <Navbar
  //     onLoginClick={() => setScreen("login")}
  //     onSignupClick={() => setScreen("signup")}
  //     />
  //   <Signup
  //   onSignupClick={() => {
  //     setScreen("dashboard")
  //     fetchCards();
  //   }}
  //   />
  //   </>
  //   )
  // }
  // if (screen === 'login'){
  //   return (
  //     <>
  //     <Navbar
  //     onLoginClick={() => setScreen("login")}
  //     onSignupClick={() => setScreen("signup")}
  //     />
  //     <Login
  //     onLoginSuccess={(user) => {
  //       setCurrentUser(user);
  //       setScreen("dashboard");
  //       fetchCards();
  //     }}
  //     onSignupClick={() => setScreen("signup")}
  //     />
  //     </>
  //   )
  // }
  // if (screen === 'dashboard'){
  //   return (
  //     <>
  //     <Navbar2
  //     onLogOutClick={() => setScreen("welcome")}
  //     />
  //     <CardDashboard cards={cards} updateCard={openEditModal} updateCallBack={onUpdate} showToast={showToast}/>
  //     <button onClick={openCreateModal} className='add-button-container'>
  //       <span className='add-button'>+ Add a Card</span>
  //     </button>
  //     <CardForm
  //       isOpen={isModalOpen}
  //       existingCard={currentCard}
  //       updateCallBack={onUpdate}
  //       onClose={closeModal}
  //       showToast={showToast}
  //     />
  //     <Toast
  //       message={toastMessage}
  //       type={toastType}
  //       isVisible={toastVisible}
  //       onClose={() => setToastVisible(false)}
  //     />
  //     </>
  //   )
  // }
  
  return (
    <>
      <Routes>
      <Route path="/" element={
        <>
          <Navbar
            onLoginClick={() => navigate("/login")}
            onSignupClick={() => navigate("/signup")}
          />
          <Welcome onGetStarted={() => navigate("/login")} />
        </>
      } />

      <Route path="/login" element={
        <>
          <Navbar
            onLoginClick={() => navigate("/login")}
            onSignupClick={() => navigate("/signup")}
          />
          <Login
            onLoginSuccess={(user) => {
              setCurrentUser(user)
              navigate("/dashboard")
            }}
            onSignupClick={() => navigate("/signup")}
          />
        </>
      } />

      <Route path="/signup" element={
        <>
          <Navbar
            onLoginClick={() => navigate("/login")}
            onSignupClick={() => navigate("/signup")}
          />
          <Signup onSignupClick={() => {
            navigate("/dashboard")
            fetchCards()
          }} />
        </>
      } />

      <Route path="/dashboard" element={
        <>
          <Navbar2 onLogOutClick={() => navigate("/")} />
          <CardDashboard
            cards={cards}
            updateCard={openEditModal}
            updateCallBack={onUpdate}
            showToast={showToast}
          />
          <button onClick={openCreateModal} className='add-button-container'>
            <span className='add-button'>+ Add a Card</span>
          </button>
          <CardForm
            isOpen={isModalOpen}
            existingCard={currentCard}
            updateCallBack={onUpdate}
            onClose={closeModal}
            showToast={showToast}
          />
          <Toast
            message={toastMessage}
            type={toastType}
            isVisible={toastVisible}
            onClose={() => setToastVisible(false)}
          />
        </>
      } />
      </Routes>
    
    </>
  )
}

export default App