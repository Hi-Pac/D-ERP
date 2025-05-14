import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import {
  People as PeopleIcon,
  ShoppingCart as SalesIcon,
  AssignmentReturn as ReturnsIcon,
  AttachMoney as RevenueIcon,
} from '@mui/icons-material';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({
  title,
  value,
  icon,
}) => (
  <Paper
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
      borderRadius: 2,
    }}
  >
    <Box
      sx={{
        p: 2,
        mb: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'primary.light',
        color: 'primary.contrastText',
        borderRadius: '50%',
        width: 60,
        height: 60,
      }}
    >
      {React.cloneElement(icon as React.ReactElement, { fontSize: 'large' })}
    </Box>
    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {title}
    </Typography>
  </Paper>
);

const Dashboard: React.FC = () => {
  // هذه بيانات وهمية للعرض، في التطبيق الحقيقي سيتم جلبها من قاعدة البيانات
  const stats = [
    { title: 'إجمالي العملاء', value: '1,234', icon: <PeopleIcon /> },
    { title: 'إجمالي المبيعات', value: '542', icon: <SalesIcon /> },
    { title: 'إجمالي المرتجعات', value: '23', icon: <ReturnsIcon /> },
    { title: 'إجمالي الإيرادات', value: '1,234,500 ج.م', icon: <RevenueIcon /> },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        لوحة التحكم
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard title={stat.title} value={stat.value} icon={stat.icon} />
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          ملخص المبيعات الشهرية
        </Typography>
        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">
            (رسم بياني للمبيعات سيظهر هنا)
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              أحدث العملاء
            </Typography>
            <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">
                (قائمة بأحدث العملاء المسجلين)
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              أحدث المبيعات
            </Typography>
            <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">
                (قائمة بأحدث الفواتير المسجلة)
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
