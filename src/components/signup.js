import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useDispatch, useSelector } from "react-redux";
import { useSignUpMutation } from "services/user-api";
import { actionSignupSucceeded, selectCurrentUser } from "store/user-slice";
import AppSpinner from "components/app-spinner";

const Signup = (props) => {
  const [formModel, setFormModel] = useState({
    username: "",
    password: "",
  });
  const [formStatus, setFormStatus] = useState({
    validated: false,
    error: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userSlice = useSelector(selectCurrentUser);
  const [signup, { isLoading: isProcessing }] = useSignUpMutation();

  useEffect(() => {
    if (userSlice?.isLoggedIn) {
      navigate("/");
    }
  }, [navigate, userSlice]);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    const isFormValid = form.checkValidity();
    setFormStatus({
      ...formStatus,
      validated: true,
    });
    if (isFormValid) {
      signup(formModel)
        .unwrap()
        .then((response) => {
          const userData = {
            username: formModel.username,
            token: response.token,
          };
          dispatch(actionSignupSucceeded(userData));
        })
        .catch((response) => {
          const msg = response.data?.error ?? response.error;
          setFormStatus({
            ...formStatus,
            error: msg,
          });
        });
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormModel({
      ...formModel,
      [name]: value,
    });
  };

  return (
    <Container>
      {isProcessing && <AppSpinner />}
      {formStatus.error && (
        <Alert variant="danger">
          <h4>Oops, {formStatus.error}</h4>
        </Alert>
      )}
      <Form noValidate validated={formStatus.validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter username"
            value={formModel.username}
            name="username"
            onChange={handleFieldChange}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a username.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Enter password"
            value={formModel.password}
            name="password"
            onChange={handleFieldChange}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a password.
          </Form.Control.Feedback>
        </Form.Group>
        <Button type="submit" variant="primary">
          Sign Up
        </Button>
      </Form>
    </Container>
  );
};

export default Signup;
