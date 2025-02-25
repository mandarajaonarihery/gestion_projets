import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import WorkIcon from '@mui/icons-material/Work';
import TaskIcon from '@mui/icons-material/Task';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from "axios";
import myLogo from '../images/log.png';
import { useNavigate } from 'react-router-dom'; 
import GestionEquipe from './chef/equipe';
import TaskManagement from './chef/tache';
import Projets from './chef/projet';
import NotificationsClient from './chef/notif';
import Dashboard from './chef/dash';
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Tableau de bord',
    icon: <DashboardIcon />,
  },
  {
    segment: 'projects',
    title: 'Projets',
    icon: <WorkIcon />,
  },
  {
    segment: 'tasks',
    title: 'Tâches',
    icon: <TaskIcon />,
  },
  {
    segment: 'team',
    title: 'Équipe',
    icon: <GroupIcon />,
  },
  {
    segment: 'notifications',
    title: 'Notifications',
    icon: <NotificationsIcon />,
  },
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
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

export default function DashboardLayoutChef(props) {
  const { window } = props;
  const router = useDemoRouter('/dashboard');
  const demoWindow = window ? window() : undefined;
  const navigate = useNavigate();


  const [session, setSession] = React.useState(null);

  React.useEffect(() => {
    const fetchSession = async () => {
      try {
        // Récupérer userId depuis localStorage
        const userId = localStorage.getItem("userId");
        const userRole = localStorage.getItem("userRole");

        if (userId && userRole) {
          // Appeler l'API pour récupérer les informations utilisateur
          const response = await axios.get(
            `${API_URL}/api/users/${userId}`
          );
          const { name, email } = response.data;

          // Mettre à jour la session avec les informations récupérées
          setSession({
            user: {
              name,
              email,
              role: userRole,
            },
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
  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      session={session}
      authentication={authentication}
      branding={{
        logo: <img src={myLogo} alt="Logo" style={{ height: '40px' }} />,
        title: 'Gestion de Projets',
      }}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <PageContainer>
          <Grid container spacing={1}>
              {/* Si l'URL correspond à la commande de projet, affiche le formulaire */}
              {router.pathname === '/team' && (
              <GestionEquipe />
            )}
            {/* Si l'URL correspond à la commande de projet, affiche le formulaire */}
            {router.pathname === '/tasks' && (
              <TaskManagement />
            )}
            {/* Si l'URL correspond à la commande de projet, affiche le formulaire */}
            {router.pathname === '/projects' && (
              <Projets />
            )}
             {router.pathname === '/dashboard' && (
              <Dashboard />
            )}
              {router.pathname === '/notifications' && (
              <NotificationsClient/>
            )}
          </Grid>
      
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
