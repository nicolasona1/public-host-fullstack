import { useState, useEffect} from 'react'
import UserList from "./UserList"
import UserForm from "./UserForm"
import Navbar from './Navbar'
import './App.css'
import Welcome from './Welcome'
import Signup from './AuthRoutes/Signup'
import Login from './AuthRoutes/Login'
import CardDashboard from './CreditCard/CardDashboard'
import CardForm from './CreditCard/CardForm'

function App() {
  //const [users, setUsers] = useState([])
  const [cards, setCards] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentCard, setCurrentCard] = useState({})
  const [currentUser, setCurrentUser] = useState({})
  const [screen, setScreen] = useState('welcome')
  useEffect(() => {
    fetchCards()
  }, [])
  
  // useEffect(() => {
  //   fetchUsers()
  // }, [])

  const fetchCards = async() => {
    try{
      const response = await fetch("http://127.0.0.1:5002/user_cards", {
        credentials: "include"
      });
      const data = await response.json()
      setCards(data.cards)
      console.log(data.cards)
    } catch (error) {
      console.log("Error fetching users:", error)
    }
  }
  
  // const fetchUsers = async () => {
  //   try {
  //     const response = await fetch("http://127.0.0.1:5002/user")
  //     const data = await response.json()
  //     setUsers(data.users)
  //     console.log(data.users)
  //   } catch (error) {
  //     console.error("Error fetching users:", error)
  //   }
  // }
  
  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentCard({})
  }
  
  // const closeModal = () =>{
  //   setIsModalOpen(false)
  //   setCurrentUser({})
  // }
  
  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true)
  }
  // const openCreateModal = () =>{
  //   if(!isModalOpen) setIsModalOpen(true)
  // }
  const openEditModal = (card) => {
    if (isModalOpen) return 
    setCurrentCard(card)
    setIsModalOpen(true)
  }
  // const openEditModal = (user) => {
  //   if (isModalOpen) return
  //   setCurrentUser(user)
  //   setIsModalOpen(true)
  // }
  const onUpdate = () => {
    closeModal()
    fetchCards()
  }
  // const onUpdate = () => {
  //   closeModal()
  //   fetchUsers()
  // }
  if (screen === 'welcome'){
    return (
      <>
      <Navbar
      onLoginClick={() => setScreen("login")}
      onSignupClick={() => setScreen("signup")}
      />
      <Welcome onGetStarted={() => setScreen("auth")}/>
      </>
    )
  }
  if (screen === 'signup'){
    return(
    <>
      <Navbar
      onLoginClick={() => setScreen("login")}
      onSignupClick={() => setScreen("signup")}
      />
    <Signup
    onSignupClick={() => setScreen("dashboard")}
    />
    </>
    )
  }
  if (screen === 'login'){
    return (
      <>
      <Navbar
      onLoginClick={() => setScreen("login")}
      onSignupClick={() => setScreen("signup")}
      />
      <Login
      onLoginSuccess={(user) => {
        setCurrentUser(user);
        setScreen("dashboard");
      }}
      />
      </>
    )
  }
  if (screen === 'dashboard'){
    return (
      <>
      <Navbar
      onLoginClick={() => setScreen("login")}
      onSignupClick={() => setScreen("signup")}
      />
      <CardDashboard cards={cards} updateCard={openEditModal} updateCallBack={onUpdate}/>
      <button onClick={openCreateModal}>Add a Card</button>
      {isModalOpen && (
        <div className='modal'>
          <div className='modal-content'>
            <span className='close' onClick={closeModal}>&times;</span>
            <CardForm existingCard={currentCard} updateCallBack={onUpdate}/>
          </div>
        </div>
      )}
      </>
    )
  }
  
  return (
    <>
      <CardDashboard cards={cards} updateCard={openEditModal} updateCallBack={onUpdate}/>
      <button onClick={openCreateModal}>Add a Card</button>
      {isModalOpen && (
        <div className='modal'>
          <div className='modal-content'>
            <span className='close' onClick={closeModal}>&times;</span>
            <CardForm existingCard={currentCard} updateCallBack={onUpdate}/>
          </div>
        </div>
      )}
      <UserList users={users} updateUser={openEditModal} updateCallback={onUpdate} />
      <button onClick={openCreateModal}>Create New Contact</button>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <UserForm existingUser={currentUser} updateCallBack={onUpdate} />
          </div>
        </div>
      )}
    </>
  )
}

export default App
