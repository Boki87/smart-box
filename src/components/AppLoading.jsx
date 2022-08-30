import { Center, Box, Spinner, Image, Text } from "@chakra-ui/react";

const AppLoading = () => {
  return (
    <Center
      position="absolute"
      top="0px"
      left="0px"
      zIndex={10}
      w="full"
      h="full"
      bg="white"
    >
      <Box position="relative">
        <Spinner position="absolute" top="-20px" right="-10px" />
        {/* <Text fontSize="2xl" fontWeight="bold">SmartBox</Text> */}
        <Image w="200px" src="/assets/images/main-logo.png" h="auto" />
      </Box>
    </Center>
  );
};

export default AppLoading;
