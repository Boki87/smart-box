import { Box, Text, Center } from "@chakra-ui/react";
import SocialIcon from "./SocialIcon";
import { sanitizeVideo } from "../lib/utils";

const DeviceSocials = ({ socials }) => {
  return (
    <Box mb="30px">
      {socials.map((social) => {
        if (social.is_public && social.type == "video") {
          return (
            <>
            <Box key={social.id} p="10px" maxW="md" mx="auto">
              <iframe
                src={sanitizeVideo(social.url)}
                style={{ width: "100%", height: "200px", borderRadius: "10px" }}
              />
            </Box>
            <Center>
              <Text color="gray.600" maxW="md" fontSize="m" textAlign="center">{social.title}</Text>
            </Center>
            </>
          );
        }
      })}

      <Box
        mb="10px"
        w="full"
        p="10px"
        maxW="md"
        display="flex"
        justifyContent="center"
        flexWrap="wrap"
        mx="auto"
      >
        {socials.map((social) => {
          if (social.type != "video") {
            return <SocialIcon key={social.id} social={social} />;
          }
        })}
      </Box>
    </Box>
  );
};

export default DeviceSocials;
