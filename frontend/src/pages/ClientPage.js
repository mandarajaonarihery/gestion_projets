import * as React from "react";
import { extendTheme, styled } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NotificationsIcon from '@mui/icons-material/Notifications'; // Icône correcte
import axios from "axios";
import myLogo from '../images/log.png';
import { useNavigate } from 'react-router-dom'; 
import ProjectForm from './client/addproject';
import Projectclient from './client/projet';
import DashboardClient from './client/dash';
import NotificationsClient from './client/notifi';
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import Grid from "@mui/material/Grid2";

const NAVIGATION = [
  {
    kind: "header",
    title: "Main Items",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "mes-projets",
    title: "Mes Projets",
    icon: <BarChartIcon />,
    children: [
      {
        segment: "Project",
        title: "Mes Projets",
        icon: <DescriptionIcon />,
      },
      {
        segment: "commander",
        title: "Commander un Nouveau Projet",
        icon: <AddCircleIcon />,
      },
    ],
  },
  {
    segment: "notification",
    title: "Notification",
    icon: <NotificationsIcon />,
  },
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: "class",
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

const Skeleton = styled("div")(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

export default function DashboardLayoutBasic(props) {
  const { window } = props;
  const navigate = useNavigate();
  const router = useDemoRouter("/dashboard");
  const [session, setSession] = React.useState(null);

  React.useEffect(() => {
    const fetchSession = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const userRole = localStorage.getItem("userRole");

        if (userId && userRole) {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`
          );
          const { name, email } = response.data;

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
        <PageContainer>
          <Grid container spacing={1}>
            {router.pathname === '/mes-projets/commander' && <ProjectForm />}
            {router.pathname === '/mes-projets/Project' && <Projectclient />}
            {router.pathname === '/dashboard' && <DashboardClient />}
            {router.pathname === '/notification' && <NotificationsClient />}
            {router.pathname === '/' && <Skeleton height={150}></Skeleton>}
            {router.pathname !== '/Team/Chef' && <Skeleton height={150}></Skeleton>}
          </Grid>
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
