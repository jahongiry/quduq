import { NotFound } from "screens/404";
import Home from "screens/home";
import Login from "screens/login";
import ProfileSuperUser from "screens/profile";
import Wells from "screens/wells";
import Wells2 from "screens/wells 2";
import WellSingle from "screens/wells/single";
// import Rivers from 'screens/rivers';
// import RiverSingle from 'screens/rivers/single';

const routes = [
  {
    index: true,
    path: "/",
    element: <Home />,
  },
  {
    path: "/wells",
    element: <Wells />,
  },
  {
    path: "/well/:id",
    element: <WellSingle />,
  },
  {
    path: "/wells/qwertyuioasdfghjkzxcvbnm",
    element: <Wells2 />,
  },
  // {
  //   path: '/rivers',
  //   element: <Rivers />
  // },
  // {
  //   path: '/river/:id',
  //   element: <RiverSingle />
  // },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/super-user-profile",
    element: <ProfileSuperUser />,
  },

  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
