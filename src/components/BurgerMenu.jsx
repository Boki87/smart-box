import { useState } from "react";
import { Button, Box, Image, Text } from "@chakra-ui/react";
import { CgMenuRight, CgClose } from "react-icons/cg";
import { useMainMenuContext } from "../context";
import { useAuthContext } from "../context";
import { useNavigate, Link } from "react-router-dom";

import { BiUser } from "react-icons/bi";
import { RiHomeLine } from "react-icons/ri";
import { issuedAtTime } from "@firebase/util";
import { FaQuestion } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
import { MdContactPhone } from "react-icons/md";

export const BurgerMenuButton = () => {
  const { toggleMainMenu } = useMainMenuContext();
  return (
    <Button
      onClick={toggleMainMenu}
      size="xl"
      padding="10px"
      rounded="full"
      variant="ghost"
      fontSize="xl"
    >
      <CgMenuRight />
    </Button>
  );
};

export const BurgerMenuBar = ({ children }) => {
  const { toggleMainMenu } = useMainMenuContext();
  return (
    <Box
      minH="50px"
      w="full"
      position="absolute"
      top="0"
      left="0"
      zIndex={3}
      css={{
        backdropFilter: "blur(10px)",
        background: "rgba(255,255,255,0.7)",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        h="50px"
        px="10px"
      >
        <Link to="/">
          <Text fontSize="2xl" fontWeight="bold">SmartBox</Text>
          {/* <Image src="/assets/images/main-logo.png" h="auto" w="90px" /> */}
        </Link>

        <Button
          onClick={toggleMainMenu}
          size="xl"
          padding="10px"
          rounded="full"
          variant="ghost"
          fontSize="xl"
        >
          <CgMenuRight />
        </Button>
      </Box>
      <Box>{children}</Box>
    </Box>
  );
};

function BurgerItemButton({ icon, children, title, to }) {
  const navigate = useNavigate();
  const { toggleMainMenu } = useMainMenuContext();

  const handleClick = () => {
    navigate(to);
    toggleMainMenu();
  };

  return (
    <Box
      onClick={handleClick}
      w="full"
      h="50px"
      bg="gray.100"
      cursor="pointer"
      color="gray.600"
      display="flex"
      alignItems="center"
      px="10px"
      mb="10px"
      _hover={{ bg: "gray.200" }}
      borderRadius="md"
    >
      <Box mr="10px">{icon}</Box>
      <Text fontSize="lg">{title}</Text>
    </Box>
  );
}

export default function BurgerMenu() {
  //const [showMenu, setShowMenu] = useState(false);
  let navigate = useNavigate();
  const { logOut, user } = useAuthContext();
  const { showMainMenu, toggleMainMenu } = useMainMenuContext();

  function logOutHandler() {
    logOut();
    toggleMainMenu();
  }

  function signInHandler() {
    navigate("/login");
    toggleMainMenu();
  }

  const menuItems = [
    {
      icon: <RiHomeLine />,
      to: "/",
      title: "Home",
      isPrivate: true,
    },
    {
      icon: <BiUser />,
      to: "/profile",
      title: "Profile",
      isPrivate: true,
    },
    {
      icon: <FaQuestion />,
      to: "/faq",
      title: "FAQ",
      isPrivate: false,
    },
    {
      icon: <HiOutlineDocumentText />,
      to: "/terms",
      title: "Terms & Conditions",
      isPrivate: false,
    },
    {
      icon: <MdContactPhone />,
      to: "/contact-us",
      title: "Contact Us",
      isPrivate: false,
    },
  ];

  return (
    <>
      {showMainMenu && (
        <Box
          position="absolute"
          top="0"
          left="0"
          w="full"
          h="full"
          bg="white"
          zIndex="9"
        >
          <Box
            h="50px"
            px="10px"
            w="full"
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Button
              onClick={toggleMainMenu}
              size="xl"
              padding="10px"
              rounded="full"
              variant="ghost"
              fontSize="xl"
            >
              <CgClose />
            </Button>
          </Box>
          <Box px="20px">
            {menuItems.map((item) => {
              if (item.isPrivate && !user) {
                return null;
              } else {
                return (
                  <BurgerItemButton
                    key={item.to}
                    icon={item.icon}
                    to={item.to}
                    title={item.title}
                  />
                );
              }
            })}
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="absolute"
            bottom="10px"
            left="0"
            w="full"
          >
            {user ? (
              <Button onClick={logOutHandler} colorScheme="blue">
                Log Out
              </Button>
            ) : (
              <Button onClick={signInHandler}>Sign In</Button>
            )}
          </Box>
        </Box>
      )}
    </>
  );
}
