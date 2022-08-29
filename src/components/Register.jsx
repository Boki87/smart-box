import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Image,
  useToast,
  Text,
  HStack,
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  FormControl,
  InputRightElement,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { BsGoogle } from "react-icons/bs";
import {
  signUp,
  registerUserWithDevice,
  isDeviceRegistered,
} from "../lib/firebase";

import { useAuthContext, useDevicesContext } from "../context";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Register = () => {
  const { user } = useAuthContext();
  const { getDevices } = useDevicesContext();

  const [deviceChecking, setDeviceChecking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  let navigate = useNavigate();
  const { id } = useParams();

  const handleShowClick = () => setShowPassword(!showPassword);

  const [formState, setFormState] = useState({
    email: "",
    password: "",
    code: "",
  });

  const toast = useToast();

  async function checkIfRegistered() {
    try {
      setDeviceChecking(true);
      let isDeviceRegisteredVal = await isDeviceRegistered(id);
      console.log(isDeviceRegisteredVal);
      setDeviceChecking(false);
      if (isDeviceRegisteredVal) {
        navigate("/");
      }
    } catch (err) {
      setDeviceChecking(false);
      console.log(err);
    }
  }

  useEffect(() => {
    checkIfRegistered();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let res = await registerUserWithDevice(
        formState.email,
        formState.password,
        formState.code,
        id
      );
      // console.log(res)
      setLoading(false);
      if (res.success) {
        if (user) {
          await getDevices(user.uid);
        }
        navigate("/");
      } else {
        toast({
          title: "Warning!",
          description: res.error,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast({
        title: "Warning!",
        description: "Something went wrong",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const inputChangeHandler = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  if (deviceChecking) {
    return (
      <Box h="full" w="full">
        <Center h="full" w="full">
          <Spinner />
        </Center>
      </Box>
    );
  }

  return (
    <Flex
      flexDirection="column"
      width="full"
      height="full"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={handleSubmit}>
            <Stack
              spacing={4}
              p="6"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
              rounded="md"
            >
              <Box textAlign={"center"}>
                <Image src="" />
                <Heading color="gray.600">SmartBox</Heading>
              </Box>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input
                    value={formState.email}
                    required
                    name="email"
                    onInput={inputChangeHandler}
                    type="email"
                    placeholder="email address"
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    value={formState.code}
                    required
                    name="code"
                    onInput={inputChangeHandler}
                    type="text"
                    placeholder="DEVICE CODE"
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    name="password"
                    value={formState.password}
                    type={showPassword ? "text" : "password"}
                    onInput={inputChangeHandler}
                    required
                    placeholder="Password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <HStack>
                <Button
                  type="submit"
                  variant="solid"
                  colorScheme="blue"
                  flex="1"
                  isLoading={loading}
                >
                  Register with TapApp
                </Button>
              </HStack>
              {/* <Box display={'flex'} justifyContent="space-between" flexWrap="wrap">
                    <Text color="blue.500" fontSize="sm" _hover={{ textDecoration: 'underline' }} as="span">
                        <Link to="/resend-confirmation">
                            Didn't receive confirmation email?
                        </Link>
                    </Text>
                    <Text color="blue.500" fontSize="sm" _hover={{ textDecoration: 'underline' }} as="span">
                        <Link to="/forgot-password">
                            Forgot Password? 
                        </Link>
                    </Text>
                </Box> */}
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Register;
