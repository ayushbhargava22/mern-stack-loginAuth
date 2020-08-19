import React, {useState} from 'react'
import {Link, Redirect} from 'react-router-dom'
import Layout from '../core/Layout'
import axios from 'axios'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import {authenticate , isAuth} from './Helpers'
import Google from './Google'
import Facebook from './Facebook'

const Signin = ({history}) => {
    const [values, setValues] = useState({
        email: 'ayushbhargava2205@gamil.com',
        password: 'rrrrrr',
        buttonText: 'Submit'
    })

    const {email, password, buttonText} = values

    const handleChange = (name) => (event) => {
        //console.log(event.target.value)
        setValues({...values, [name]: event.target.value})
    }

    const informParent = response => {
        authenticate(response, () => {
            isAuth() && isAuth().role === 'admin' ? history.push('/admin') : history.push('/private')
        })
    }

    const clickSubmit = event => {
        event.preventDefault()
        setValues({...values, buttonText: 'Submitting'})
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/signin`,
            data: {email, password}
        })
        .then(response => {
            console.log('signin success', response)
            
            authenticate(response, () => {
                setValues({...values, name:'',email: '', password: '', buttonText: 'Submitted'})
                //toast.success(`Hey ${response.data.user.name}, Welcome back!`)
                isAuth() && isAuth().role === 'admin' ? history.push('/admin') : history.push('/private')
            })
            
        })
        .catch(error => {
            console.log('SIGNIN ERROR', error.response.data)
            setValues({...values, buttonText: 'Submit Again'})
            toast.error(error.response.data.error)
        })
    }

    const signinForm = () => (
        <form>
            
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')} value={email} type="email" className="form-control" />
            </div>

            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handleChange('password')} value={password} type="password" className="form-control" />
            </div>

            <div>
                <button className="btn btn-primary" onClick={clickSubmit}>{buttonText}</button>
            </div>
        </form>
    ) 

    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
            <ToastContainer />
            {isAuth() ? <Redirect to="/" /> : null}
            <h1 className="pt-5 text-center">Signin</h1>
            <Google informParent={informParent} />
            <Facebook informParent={informParent} />
            {signinForm()}
            </div>
        </Layout>
    )
} 


export default Signin;