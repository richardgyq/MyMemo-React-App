import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import MemoDetails from 'components/memo-details';
import MemoList from 'components/memo-list';
import Login from 'components/login';
import Signup from 'components/signup';
import Bye from 'components/bye';
import { Container } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { thunkLogout } from 'store/user';
import { CREATE_MEMO, UPDATE_MEMO } from './constants';


function App() {
  const { user } = useSelector(state => state.sliceUser);
  const dispatch = useDispatch();

  async function logout() {
    dispatch(thunkLogout());
  }
 
  return (
    <div className="App">
      <Navbar bg="primary" variant="dark">
        <Container>
        <Navbar.Brand>GYQ</Navbar.Brand>
          <Nav className='me-auto'>
            <Link className='nav-link' to='/'>My Memos</Link>
            {
              user.username ? (
                <Link className='nav-link' to='/bye' onClick={logout}>Logout({user.username})</Link>
              ) : (
                <>
                  <Link className='nav-link' to='/login'>Login</Link>
                  <Link className='nav-link' to='/signup'>Sign Up</Link>
                </>
              )
            }
          </Nav>
        </Container>
      </Navbar>

      <div className='container mt-4'>
        <Routes>
          <Route path='/'
            element={<MemoList />}>
          </Route>
          <Route path='/bye'
            element={<Bye />}>
          </Route>
          <Route path='/memos/create'
            element={<MemoDetails mode={CREATE_MEMO} />}>
          </Route>
          <Route path='/memos/:id/'
            element={<MemoDetails mode={UPDATE_MEMO} />}>
          </Route>
          <Route path='/login'
            element={<Login />}>
          </Route>
          <Route path='/signup'
            element={<Signup />}>
          </Route>
        </Routes>
      </div>

      <footer className='text-center text-lg-start bg-light text-muted mt-4'>
        <div className='text-center p-4'>
          Author: Richard Guo
        </div>
      </footer>
    </div>
  );
}

export default App;
