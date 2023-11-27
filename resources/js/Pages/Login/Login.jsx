import React, { useState, useLayoutEffect } from 'react';
import { loginUser, useAuthState, useAuthDispatch } from '../../Context';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login = () => 
{
  const navigate = useNavigate();
  const dispatch = useAuthDispatch();
  const { loading, errorMessage } = useAuthState();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useLayoutEffect(() => {
    let user = localStorage.getItem("currentUser")
    if (user) {
      return navigate('/')
    }   
  }, [])
  

  const handleLogin = async (e) => 
  {
    e.preventDefault()
    try 
    {
      let response = await loginUser(dispatch, { email, password})
      if (!response.user) return;
      navigate('/profile', {replace: true})
     
    } catch(error) 
    {
      console.log(error);
    }
  }

  return (
    <div>
      <div>
        <Link to={'/'}>Home</Link>
      </div>
      <h1>Login Page</h1>
      {errorMessage ? <p>{errorMessage}</p> : null}
      <form>
        <div>
          <div>
            <label htmlFor='email'>Username</label>
            <input 
              type='text' 
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input 
              type='password'
              id='password' 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        <button 
          onClick={handleLogin}
          disabled={loading}
        >
          login
        </button>
      </form>
      <p>¿No tienes usuario? <Link to={'/register'}>Registrate</Link> </p>
    </div>
  );
}

export default Login;