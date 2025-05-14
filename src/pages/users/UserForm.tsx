# تهيئة مستودع Git محلي
git init

# إضافة جميع الملفات للمرحلة
git add .

# عمل commit للتغييرات
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Avatar,
  IconButton,
  Typography,
  Box,
  Divider,
  FormControlLabel,
  Switch,
  FormGroup,
  Paper,
  Chip,
  Alert,
  Collapse,
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  PhotoCamera as PhotoCameraIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  ManageAccounts as ManageAccountsIcon,
  PersonOff as PersonOffIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import ar from 'date-fns/locale/ar-SA';

// أنواع البيانات
interface User {
  id?: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'admin' | 'manager' | 'sales' | 'accountant' | 'viewer';
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  avatar?: string;
  password?: string;
  confirmPassword?: string;
}

// أنواع الخصائص
interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>, userId?: string) => void;
  user?: User;
}

// أسماء الأدوار
const roleNames = {
  admin: 'مدير النظام',
  manager: 'مدير',
  sales: 'مندوب مبيعات',
  accountant: 'محاسب',
  viewer: 'مستخدم للعرض فقط',
};

// أيقونات الأدوار
const roleIcons = {
  admin: <AdminPanelSettingsIcon />,
  manager: <ManageAccountsIcon />,
  sales: <PersonIcon />,
  accountant: <ManageAccountsIcon />,
  viewer: <PersonOffIcon />,
};

const UserForm: React.FC<UserFormProps> = ({ open, onClose, onSave, user }) => {
  // حالة النموذج
  const [formData, setFormData] = useState<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>({
    username: '',
    email: '',
    fullName: '',
    phone: '',
    role: 'viewer',
    isActive: true,
    password: '',
    confirmPassword: '',
  });

  // أخطاء التحقق من الصحة
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // تعبئة النموذج ببيانات المستخدم في وضع التعديل
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        fullName: user.fullName || '',
        phone: user.phone || '',
        role: user.role || 'viewer',
        isActive: user.isActive !== undefined ? user.isActive : true,
        password: '',
        confirmPassword: '',
        avatar: user.avatar,
      });
      setAvatarPreview(user.avatar || null);
      setIsEditMode(true);
    } else {
      // إعادة تعيين النموذج عند إضافة مستخدم جديد
      setFormData({
        username: '',
        email: '',
        fullName: '',
        phone: '',
        role: 'viewer',
        isActive: true,
        password: '',
        confirmPassword: '',
      });
      setAvatarPreview(null);
      setIsEditMode(false);
      setShowPasswordFields(true);
    }
    setErrors({});
  }, [user, open]);

  // معالجة تغيير حقول النموذج
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // مسح رسالة الخطأ عند تصحيح الحقل
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // معالجة تغيير الدور
  const handleRoleChange = (e: SelectChangeEvent<string>) => {
    const role = e.target.value as User['role'];
    setFormData(prev => ({
      ...prev,
      role,
    }));
  };

  // معالجة تحميل صورة الملف الشخصي
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          avatar: 'الرجاء تحميل صورة صالحة',
        }));
        return;
      }

      // عرض معاينة الصورة
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setFormData(prev => ({
          ...prev,
          avatar: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // التحقق من صحة البريد الإلكتروني
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // التحقق من صحة كلمة المرور
  const validatePassword = (password: string) => {
    if (isEditMode && !showPasswordFields) return true;
    return password.length >= 8;
  };

  // التحقق من صحة النموذج
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = 'اسم المستخدم مطلوب';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
      isValid = false;
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'الاسم الكامل مطلوب';
      isValid = false;
    }

    if (formData.phone && !/^[0-9+\-\s]+$/.test(formData.phone)) {
      newErrors.phone = 'رقم الهاتف غير صالح';
      isValid = false;
    }

    if (!formData.role) {
      newErrors.role = 'يجب اختيار دور للمستخدم';
      isValid = false;
    }

    // التحقق من كلمة المرور في حالة إضافة مستخدم جديد أو تغيير كلمة المرور
    if ((!isEditMode || showPasswordFields) && !formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
      isValid = false;
    } else if (formData.password && !validatePassword(formData.password)) {
      newErrors.password = 'يجب أن تكون كلمة المرور 8 أحرف على الأقل';
      isValid = false;
    }

    if ((!isEditMode || showPasswordFields) && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمتا المرور غير متطابقتين';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // معالجة إرسال النموذج
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // إنشاء كائن المستخدم مع استبعاد confirmPassword
      const { confirmPassword, ...userData } = formData;
      
      // إذا كان في وضع التعديل ولم يتم تغيير كلمة المرور، قم بإزالة حقل كلمة المرور
      if (isEditMode && !showPasswordFields) {
        delete userData.password;
      }
      
      onSave(userData, user?.id);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      role: user?.role || 'viewer',
      isActive: user?.isActive !== undefined ? user.isActive : true,
      password: '',
      confirmPassword: '',
      avatar: user?.avatar,
    });
    setErrors({});
  };

  // معالجة إغلاق النموذج
  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '60vh',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {isEditMode ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد'}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Collapse in={showSuccessAlert}>
            <Alert severity="success" sx={{ mb: 2 }}>
              تم {isEditMode ? 'تحديث' : 'حفظ'} بيانات المستخدم بنجاح
            </Alert>
          </Collapse>
          
          <Grid container spacing={3}>
            {/* العمود الأول: الصورة والمعلومات الأساسية */}
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                  <Avatar
                    src={avatarPreview || undefined}
                    alt={formData.fullName || 'صورة المستخدم'}
                    sx={{
                      width: 120,
                      height: 120,
                      fontSize: 48,
                      margin: '0 auto',
                      border: '2px solid',
                      borderColor: 'divider',
                    }}
                  >
                    {formData.fullName ? formData.fullName.charAt(0) : <PersonIcon fontSize="large" />}
                  </Avatar>
                  <input
                    accept="image/*"
                    id="avatar-upload"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleAvatarChange}
                  />
                  <label htmlFor="avatar-upload">
                    <IconButton
                      color="primary"
                      aria-label="تحميل صورة"
                      component="span"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                      }}
                    >
                      <PhotoCameraIcon />
                    </IconButton>
                  </label>
                </Box>
                
                <Typography variant="subtitle1" gutterBottom>
                  {formData.fullName || 'اسم المستخدم'}
                </Typography>
                
                <Chip
                  icon={roleIcons[formData.role]}
                  label={roleNames[formData.role]}
                  color={
                    formData.role === 'admin' ? 'error' :
                    formData.role === 'manager' ? 'warning' :
                    formData.role === 'sales' ? 'primary' :
                    formData.role === 'accountant' ? 'info' : 'default'
                  }
                  variant="outlined"
                  size="small"
                  sx={{ mb: 1 }}
                />
                
                <FormGroup sx={{ mt: 2, textAlign: 'right' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            isActive: e.target.checked,
                          }))
                        }
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        {formData.isActive ? 'نشط' : 'معطل'}
                      </Typography>
                    }
                    labelPlacement="start"
                    sx={{
                      m: 0,
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  />
                </FormGroup>
                
                {isEditMode && (
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                    sx={{ mt: 2 }}
                  >
                    {showPasswordFields ? 'إلغاء تغيير كلمة المرور' : 'تغيير كلمة المرور'}
                  </Button>
                )}
              </Paper>
              
              {/* معلومات إضافية */}
              {isEditMode && (
                <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    معلومات إضافية
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="textSecondary" display="block">
                      تاريخ الإنشاء
                    </Typography>
                    <Typography variant="body2">
                      {user?.createdAt ? format(new Date(user.createdAt), 'dd/MM/yyyy') : 'غير معروف'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="textSecondary" display="block">
                      آخر تحديث
                    </Typography>
                    <Typography variant="body2">
                      {user?.updatedAt ? format(new Date(user.updatedAt), 'dd/MM/yyyy') : 'غير معروف'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="caption" color="textSecondary" display="block">
                      آخر تسجيل دخول
                    </Typography>
                    <Typography variant="body2">
                      {user?.lastLogin 
                        ? format(new Date(user.lastLogin), 'dd/MM/yyyy HH:mm') 
                        : 'لم يسجل دخول بعد'}
                    </Typography>
                  </Box>
                </Paper>
              )}
            </Grid>
            
            {/* العمود الثاني: تفاصيل المستخدم */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="اسم المستخدم"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    error={!!errors.username}
                    helperText={errors.username}
                    margin="normal"
                    required
                    disabled={isEditMode}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="البريد الإلكتروني"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    margin="normal"
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="الاسم الكامل"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    margin="normal"
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="رقم الهاتف"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={!!errors.phone}
                    helperText={errors.phone || 'اختياري'}
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl 
                    fullWidth 
                    margin="normal"
                    error={!!errors.role}
                    required
                  >
                    <InputLabel>الدور</InputLabel>
                    <Select
                      name="role"
                      value={formData.role}
                      onChange={handleRoleChange}
                      label="الدور"
                    >
                      {Object.entries(roleNames).map(([value, label]) => (
                        <MenuItem 
                          key={value} 
                          value={value}
                          disabled={isEditMode && user?.role === 'admin' && value !== 'admin'}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {roleIcons[value as keyof typeof roleIcons]}
                            {label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                  </FormControl>
                </Grid>
                
                {/* حقول كلمة المرور */}
                {(showPasswordFields || !isEditMode) && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }}>
                        <Typography variant="caption" color="textSecondary">
                          كلمة المرور
                        </Typography>
                      </Divider>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="كلمة المرور"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        error={!!errors.password}
                        helperText={errors.password || (isEditMode ? 'اتركه فارغًا إذا كنت لا تريد تغيير كلمة المرور' : 'يجب أن تحتوي على 8 أحرف على الأقل')}
                        margin="normal"
                        required={!isEditMode}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="تأكيد كلمة المرور"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        margin="normal"
                        required={!isEditMode}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            color="inherit" 
            onClick={handleClose}
            startIcon={<CloseIcon />}
          >
            إلغاء
          </Button>
          
          <Box>
            {isEditMode && (
              <Button
                variant="outlined"
                color="error"
                sx={{ mr: 1 }}
                startIcon={<DeleteIcon />}
                onClick={() => {
                  // سيتم التعامل مع الحذف في المكون الأب
                  onClose();
                }}
              >
                حذف
              </Button>
            )}
            
            <Button
              variant="contained"
              type="submit"
              startIcon={<SaveIcon />}
            >
              {isEditMode ? 'حفظ التغييرات' : 'حفظ'}
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserForm;
