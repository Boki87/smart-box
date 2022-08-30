import {Link } from 'react-router-dom'
import { Box, Image } from "@chakra-ui/react";
import {FiEdit} from 'react-icons/fi'

export default function DeviceCard({ device }) {
  return (
    <Box
      w="full"
      maxW="sm"
      mx="auto"
      h="300px"
      rounded="xl"
      shadow="md"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      mb="20px"
      cursor="pointer"
      position="relative"
    >
      <Link 
        to={`d/${device.id}`}
        style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
      >
      {/* <a href="#"> */}
        <Image
          src={device.device_type.image}
          minW="100%"
          minH="100%"
          objectFit="cover"
        />
      {/* </a> */}
      </Link>

      <Link to={`edit/${device.id}`}>
        <Box position="absolute" bottom="0" right="0" color="whiteAlpha.800" w="35px" h="35px" cursor="pointer" display="flex" alignItems="center" justifyContent="center" fontSize="xl">
          <FiEdit />
        </Box>
      </Link>
    </Box>
  );
}
