import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getDeviceData,
  getSocialsForDevice,
  addDeviceVisitEntry,
} from "../lib/firebase";
import {
  Button,
  Text,
  Box,
  useToast,
  Center,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { useDevicesContext } from "../context";
import DeviceHero from "./DeviceHero";
import DeviceCTA from "./DeviceCTA";
import DeviceSocials from "./DeviceSocials";
import FooterSocials from "./FooterSocials";
import AppLoading from "./AppLoading";
import { useAuthContext } from "../context";

const Device = () => {
  const [loading, setLoading] = useState(false);
  const [deviceData, setDeviceData] = useState(null);
  const [socialsData, setSocialsData] = useState([]);
  let navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const { checkIfDeviceIsRegistered } = useDevicesContext();
  const { user } = useAuthContext();

  async function int() {
    try {
      setLoading(true);
      let isRegistered = await checkIfDeviceIsRegistered(id);
      if (isRegistered) {
        let deviceRes = await getDeviceData(id);
        //add visit entry
        if (user && user?.uid !== deviceRes.user_id) {
          //add entry
          await addDeviceVisitEntry(deviceRes.id, deviceRes.user_id);
          console.log("add visit entry");
        }

        if (!user) {
          // console.log("add device visit");
          // console.log(deviceRes);
          await addDeviceVisitEntry(deviceRes.id, deviceRes.user_id);
        }

        await setDeviceData(deviceRes);
        let socials = await getSocialsForDevice(id, deviceRes.user_id);
        setSocialsData(socials);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    int();
  }, []);

  if (loading) {
    return <AppLoading />;
  }

  if (!deviceData) {
    return (
      <Center w="full" h="full" bg="white">
        <Box textAlign={"center"} fontSize="xl">
          <Text textColor="red.400">Error fetching device data 🙁</Text>
          <Text textColor="red.400">Try re-loading the page please</Text>
        </Box>
      </Center>
    );
  }

  if (!deviceData.is_edited) {
    if (!user) {
      navigate("/login");
    }
    return (
      <Center w="full" h="full" bg="white">
        <Box textAlign={"center"} fontSize="xl">
          <Link to={`/edit/${id}`}>
            <Button colorScheme="blue" mb="10px" size="lg">
              Setup
            </Button>
            <Text>Your device for the first time</Text>
          </Link>
        </Box>
      </Center>
    );
  }

  return (
    <Box h="full" w="full" overflow="auto">
      <DeviceHero device={deviceData} />
      <DeviceCTA deviceData={deviceData} socialsData={socialsData} />
      <DeviceSocials socials={socialsData} />
      <FooterSocials />
    </Box>
  );
};

export default Device;
