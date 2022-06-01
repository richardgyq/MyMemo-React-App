import {React, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useSelector, useDispatch } from 'react-redux';
import { thunkSignup } from 'store/user';
import AppSpinner from 'components/app-spinner';


const Signup = props => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isProcessing, error } = useSelector(state => state.sliceUser);

    useEffect(() => {
        if (user.token) {
            navigate('/');
        }
    }, [navigate, user.token]);

    const handleSubmit = event => {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
        const form = event.currentTarget;
        if (form.checkValidity()) {
            signup();
        }
    };
  
    const onChangeUsername = e => {
        const username = e.target.value;
        setUsername(username);
    };

    const onChangePassword = e => {
        const password = e.target.value;
        setPassword(password);
    };

    const signup = () => {
        dispatch(thunkSignup({username, password}));
    };

    return (
        <Container>
        { isProcessing && (
            <AppSpinner />
        )}
        { error && (
            <Alert variant='danger'>
                <h4>Oops, {error}</h4>
            </Alert>
        )}
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className='mb-3'>
                <Form.Label>Username</Form.Label>
                <Form.Control required type='text' placeholder='Enter username'
                value={username} onChange={onChangeUsername} />
                <Form.Control.Feedback type="invalid">
                    Please enter a username.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Label>Password</Form.Label>
                <Form.Control required type='password' placeholder='Enter password'
                value={password} onChange={onChangePassword} />
                <Form.Control.Feedback type="invalid">
                    Please enter a password.
                </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" variant='primary'>Sign Up</Button>
        </Form>
        </Container>
    );
}

export default Signup;
