import React, { useState } from 'react';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Card,
  InputGroup,
  Fade,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { useForm, Controller } from 'react-hook-form';
import { login } from '../server/apiservice';
import '../Styles/Login.css';

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: { username: '', password: '' },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const { token, user } = await login({
        username: data.username.trim(),
        password: data.password,
      });
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/profile');
    } catch (err) {
      setServerError(
        err.response?.status === 401
          ? 'Invalid username or password.'
          : err.message || 'Login failed. Please try again.'
      );
      setError('username', { type: 'manual', message: '' });
      setError('password', { type: 'manual', message: '' });
    }
  };

  return (
    <>
    <Fade in appear>
      <Container
        fluid
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: '100vh', background: '#f8f9fa' }}
      >
        <Row className="w-100 justify-content-center">
          <Col xs={12} sm={10} md={8} lg={5} xl={4}>
            <Card className="auth-card shadow-lg border-0">
              <Card.Body className="p-4 p-md-5">
                <h2 className="text-center mb-4 auth-title">Welcome Login</h2>
                {serverError && (
                  <Alert variant="danger" className="auth-alert" aria-live="assertive">
                    {serverError}
                  </Alert>
                )}
                <Form noValidate onSubmit={handleSubmit(onSubmit)} autoComplete="on">
                  <Form.Group controlId="username" className="mb-4">
                    <Form.Label className="auth-label">Username</Form.Label>
                    <Controller
                      name="username"
                      control={control}
                      rules={{
                        required: 'Please enter your username.',
                        maxLength: { value: 32, message: 'Max 32 characters.' },
                      }}
                      render={({ field }) => (
                        <Form.Control
                          {...field}
                          type="text"
                          placeholder="Enter your username"
                          isInvalid={!!errors.username}
                          className="auth-input"
                          aria-label="Username"
                          autoComplete="username"
                        />
                      )}
                    />
                    <Form.Control.Feedback type="invalid" className="auth-feedback">
                      {errors.username?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="password" className="mb-4">
                    <Form.Label className="auth-label">Password</Form.Label>
                    <InputGroup>
                      <Controller
                        name="password"
                        control={control}
                        rules={{
                          required: 'Please enter your password.',
                          maxLength: { value: 32, message: 'Max 32 characters.' },
                        }}
                        render={({ field }) => (
                          <Form.Control
                            {...field}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            isInvalid={!!errors.password}
                            className="auth-input"
                            aria-label="Password"
                            autoComplete="current-password"
                          />
                        )}
                      />
                      <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="auth-toggle"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        tabIndex={0}
                      >
                        {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                      </Button>
                    </InputGroup>
                    <Form.Control.Feedback type="invalid" className="auth-feedback">
                      {errors.password?.message}
                    </Form.Control.Feedback>
                    <div className="text-end mt-2">
                      <Button
                        variant="link"
                        className="auth-link-small p-0"
                        onClick={() => navigate('/forgot-password')}
                        tabIndex={0}
                      >
                        Forgot Password?
                      </Button>
                    </div>
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 auth-button"
                    disabled={isSubmitting}
                    aria-label="Login button"
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        Logging in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </Form>
                <div className="text-center mt-4">
                  <span className="auth-text">
                    Don’t have an account?{' '}
                    <Button
                      variant="link"
                      className="auth-link p-0"
                      onClick={() => navigate('/register')}
                      tabIndex={0}
                    >
                      Sign Up
                    </Button>
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fade>
    </>
  );
};

export default Login;