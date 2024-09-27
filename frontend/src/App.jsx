import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage.jsx";
import PostPage from "./pages/PostPage.jsx";
import Header from "./components/Header.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UserProfileEdit from "./pages/UpdateProfile";
import CreatePost from "./components/CreatePost.jsx";
import Chat from "./pages/Chat.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";




function App() {
  const user = useRecoilValue(userAtom);
  const  { pathname } = useLocation();


  return (
    <Box position={'relative'} w={'full'}>
    <Container maxW={pathname === '/' ? {'base':'600px','md':'900px'} : '620px'}>
      <Header />
   <Routes>
   <Route path='/' element={user ? <HomePage /> : <Navigate to='/auth' />} />
   
    <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to='/' />}/>

    <Route path='/update' element={user ? <UserProfileEdit /> : <Navigate to='/auth' />} />

    <Route path="/:username" element={user ? <><UserPage /><CreatePost /></> : <UserPage /> } />

    <Route path="/:username/post/:pid" element={<PostPage />}/>

    <Route path="/chat" element={user ? <Chat /> : <Navigate to='/auth' />}/>

    <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to='/auth' />}/>
   </Routes>

    </Container>
    </Box>
  )
}

export default App
