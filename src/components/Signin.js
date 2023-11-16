import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Signin.css'

const Signin = (props) => {
    const [credentials, setCredentials] = useState({email: "", password: ""})
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password})
      
        });

        const json = await response.json()
        console.log(json);

        if(json.success){
            //Save the auth token and redirect
            localStorage.setItem('token', json.authtoken);
            navigate("/")
            props.showAlert("Signed in Successfully", "success")

        }
        else{
            props.showAlert("Invalid Details", "danger")
        }

    }

    const onChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    return (
        <div className='mt-2 container'>
            <h2 id='heading'>Sign-in to use NoteBook</h2>
            <form onSubmit={handleSubmit} className='my-4 inner-container' >
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" value={credentials.email}onChange={onChange}/>
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" name='password' id="password" value={credentials.password}onChange={onChange}/>
                </div>
                <button type="submit" className="btn btn-primary">Sign in</button>
            </form> 
        </div>
    )
}

export default Signin
