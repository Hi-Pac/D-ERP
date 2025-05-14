import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Container, 
  Alert, 
  Checkbox, 
  FormControlLabel, 
  Link, 
  Divider, 
  Stack,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined, EmailOutlined } from '@mui/icons-material';
import Logo from '../assets/logo.png'; // تأكد من وجود ملف الشعار في المسار الصحيح

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  // Load saved credentials if "Remember me" was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      // Save credentials if "Remember me" is checked
      if (rememberMe) {
        localStorage.setItem('savedEmail', email);
        localStorage.setItem('savedPassword', password);
      } else {
        localStorage.removeItem('savedEmail');
        localStorage.removeItem('savedPassword');
      }
      
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      let errorMessage = 'فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.';
      
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'تم تعطيل الحساب مؤقتًا بسبب محاولات تسجيل دخول فاشلة متعددة. يرجى المحاولة مرة أخرى لاحقًا أو إعادة تعيين كلمة المرور.';
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = 'هذا الحساب معطل. يرجى التواصل مع المسؤول.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@example.com');
    setPassword('demo1234');
    setRememberMe(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box
            component="img"
            src={Logo}
            alt="Al-Harmeen Paints Logo"
            sx={{
              width: 120,
              height: 'auto',
              mb: 2,
            }}
          />
          <Typography component="h1" variant="h4" color="primary" fontWeight="bold">
            نظام إدارة الدهانات
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            نظام متكامل لإدارة أعمال شركة الدهانات
          </Typography>
        </Box>

        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 2, sm: 4 },
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography component="h2" variant="h5" align="center" sx={{ mb: 3, fontWeight: 'bold' }}>
            تسجيل الدخول
          </Typography>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                '& .MuiAlert-message': {
                  textAlign: 'right',
                  width: '100%'
                }
              }}
            >
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="البريد الإلكتروني"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined color="action" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="كلمة المرور"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    value="remember" 
                    color="primary" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                }
                label="تذكرني"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
              
              <Link 
                component={RouterLink} 
                to="/forgot-password" 
                variant="body2"
                sx={{ textDecoration: 'none' }}
              >
                نسيت كلمة المرور؟
              </Link>
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              size="large"
              sx={{
                mt: 1,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'تسجيل الدخول'
              )}
            </Button>
            
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">أو</Typography>
            </Divider>
            
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleDemoLogin}
              sx={{
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: '0.9375rem',
                textTransform: 'none',
                fontWeight: 'medium',
              }}
            >
              تجربة النسخة التجريبية
            </Button>
            
            <Stack direction="row" justifyContent="center" spacing={1} mt={2}>
              <Typography variant="body2" color="text.secondary">
                ليس لديك حساب؟
              </Typography>
              <Link 
                component={RouterLink} 
                to="/register" 
                variant="body2"
                fontWeight="medium"
                sx={{ textDecoration: 'none' }}
              >
                إنشاء حساب جديد
              </Link>
            </Stack>
          </Box>
        </Paper>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} نظام إدارة الدهانات. جميع الحقوق محفوظة.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
