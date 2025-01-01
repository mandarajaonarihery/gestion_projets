import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box } from '@mui/material';
import ProjectManagementList from './admin/projectmanage'; 
import Badge from '@mui/material/Badge';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid2';
import myLogo from '../images/log.png';
import GroupsIcon from '@mui/icons-material/Groups';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import axios from "axios";
import ChefManagement from './admin/Table';  
import TeamCRUD from './admin/TeamCRUD'; 
import NotificationList from './admin/notification'; 
import { useNavigate } from 'react-router-dom'; 
import NotificationsBadge from './admin/notifb';
import { useState, useEffect } from 'react';
import DashboardAdmin from './admin/dash';
const backendURL = process.env.REACT_APP_BACKEND_URL;
const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
 
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'Personne',
    title: 'Personne',
    icon: <GroupsIcon />,
   
  },
  {
    segment: 'equipe',
    title: 'Equipe existant',
    icon: <PeopleAltIcon />,
  },
  {
    segment: 'notifications',
    title: 'Notifications',
    icon: <NotificationsBadge />,
  },
  {
    segment: 'Gestionprojet',
    title: 'Gestion de projet',
    icon: <ShoppingCartIcon />,
  },
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

const Skeleton = styled('div')(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

export default function DashboardLayoutBasic(props) {
  const { window } = props;
  const router = useDemoRouter('/dashboard');
  const navigate = useNavigate();
  const [session, setSession] = React.useState(null);

  React.useEffect(() => {
    const fetchSession = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const userRole = localStorage.getItem("userRole");

        if (userId && userRole) {
          const response = await axios.get(
            `${backendURL}/api/users/${userId}`
          );
          const { name, email } = response.data;

          setSession({
            user: { name, email, role: userRole },
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des informations utilisateur:", error);
        setSession(null);
      }
    };

    fetchSession();
  }, []);

  const authentication = React.useMemo(
    () => ({
      signIn: (user) => {
        setSession({ user });
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userRole", user.role);
      },
      signOut: () => {
        setSession(null);
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        navigate("/login");
      },
    }),
    []
  );
  const getRoleFromPath = (path) => {
    if (path.includes('Client')) return 'client';
    if (path.includes('Chef')) return 'chef_projet';
    if (path.includes('membre')) return 'membre';
    if (path.includes('equipe')) return 'Equipe';
    return '';
  };
  const demoWindow = window ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      session={session}
      authentication={authentication}
      branding={{
        logo: <img src={myLogo} alt="Logo" style={{ height: '40px' }} />,
        title: 'Gestion de Projets',
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
     
    >
      <DashboardLayout>
        <PageContainer         
        >
        
          <Grid container spacing={1}>
          {router.pathname === '/dashboard' && (
  <DashboardAdmin />
)}
{router.pathname.startsWith('/Personne') && (
  <ChefManagement title={getRoleFromPath(router.pathname)} />
)}

{router.pathname === '/notifications' && (
<Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%', overflowY: 'auto', p: 2 }}>
  <NotificationList />
</Box>
)}
{router.pathname === '/equipe' && (
<Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%', overflowY: 'auto', p: 2 }}>
  <TeamCRUD />
</Box>
)}
{router.pathname === '/Gestionprojet' && (
<Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%', overflowY: 'auto', p: 2 }}>
  <ProjectManagementList />
</Box>
)}

{router.pathname !== '/Gestionprojet' && router.pathname !== '/Personne' && (
<Skeleton variant="rectangular" width="100%" height={200} />
)}

          </Grid>
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}





