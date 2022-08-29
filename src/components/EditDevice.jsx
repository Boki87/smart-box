import { useEffect, useState } from "react";
import {
  Text,
  Input,
  FormControl,
  FormLabel,
  Button,
  Box,
  Center,
  Spinner,
  Image,
  Avatar,
  Textarea,
  Spacer,
  Progress,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import { useParams, Link } from "react-router-dom";
import { BurgerMenuBar, BurgerMenuButton } from "./BurgerMenu";
import {
  getDeviceData,
  getSocialsForDevice,
  updateDeviceData,
  uploadAvatar,
} from "../lib/firebase";
import { useAuthContext, useSocialsContext } from "../context";
import { BsUpload } from "react-icons/bs";
import { VscAdd } from "react-icons/vsc";
import { useDebounce } from "../lib/hooks";
import ChakraColorPicker from "./ChakraColorPicker";
import { compressImage } from "../lib/utils";
import SocialIconDrawer from "./SocialIconDrawer";
import SocialIconEditDrawer from "./SocialIconEditDrawer";
import SocialIcon from "./SocialIcon";
import VideoEmbedEdit from "./VideoEmbedEdit";

const EditDevice = () => {
  let toast = useToast();
  const { id } = useParams();
  const { user } = useAuthContext();
  const { socials, setSocials, activeEditLink, setActiveEditLink } =
    useSocialsContext();
  const [deviceData, setDeviceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(true);
  const [embeddedVideo, setEmbeddedVideo] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  useEffect(() => {
    if (activeEditLink) {
      setIsEditDrawerOpen(true);
    } else {
      setIsEditDrawerOpen(false);
    }
  }, [activeEditLink]);

  const debounceName = useDebounce(deviceData?.name, 1000);
  const debounceTitle = useDebounce(deviceData?.title, 1000);
  const debounceDescription = useDebounce(deviceData?.description, 1000);

  const handleColorChange = (color) => {
    setDeviceData({ ...deviceData, bg_color: color });
    updateData(id, { ...deviceData, bg_color: color });
  };

  async function fetchDeviceData() {
    try {
      setLoading(true);
      let deviceData = await getDeviceData(id);
      setDeviceData(deviceData);
      let socials = await getSocialsForDevice(id, user.uid);
      setSocials(socials);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  function deviceDataPropChange(e) {
    setDeviceData({ ...deviceData, [e.target.name]: e.target.value });
  }

  async function updateData(id, data) {
    try {
      setUpdating(true);
      await updateDeviceData(id, data);
      setUpdating(false);
    } catch (err) {
      setUpdating(false);
      console.log(err);
    }
  }

  async function handleAvatarChange(e) {
    let avatar = e.target.files[0];
    if (!avatar) return;

    try {
      setUpdating(true);

      let compressedAvatar = await compressImage(avatar);
      avatar = compressedAvatar;

      let res = await uploadAvatar(avatar, id);
      updateData(id, { avatar: res });
      setDeviceData({ ...deviceData, avatar: res });

      setUpdating(false);
    } catch (err) {
      console.log(err);
      setUpdating(false);
      toast({
        title: "Warning!",
        description: "Image format not supported",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }

  useEffect(() => {
    fetchDeviceData();
  }, [id]);

  useEffect(() => {
    // console.log(deviceData)
    updateData(id, deviceData);
  }, [debounceName, debounceTitle, debounceDescription]);

  useEffect(() => {
    //get embedded video
    let video = socials.find((s) => s.provider === "video");
    if (socials.length > 0 && video) {
      setEmbeddedVideo(video);
    } else {
      setEmbeddedVideo(null);
    }
  }, [socials]);

  let showExplainer = false;
  if (socials.length > 0 && !embeddedVideo) {
    showExplainer = true;
  } else if (socials.length == 1 && embeddedVideo) {
    showExplainer = false;
  } else if (socials.length > 0 && !embeddedVideo) {
    showExplainer = true;
  } else if (socials.length > 0 && embeddedVideo) {
    showExplainer = true;
  }

  if (loading || !deviceData) {
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
          <Text fontSize="2xl" fontWeight="bold">SmartBox</Text>
          {/* <Image w="200px" src="/assets/images/main-logo.png" h="auto" /> */}
        </Box>
      </Center>
    );
  }

  return (
    <Box w="full" h="full" pt="10px" px="10px" pb="80px" overflow="auto">
      {updating && (
        <Progress
          size="xs"
          isIndeterminate
          position="absolute"
          top="0"
          left="0"
          w="full"
        />
      )}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        w="full"
        justifyContent="center"
        bg={deviceData.bg_color ? deviceData.bg_color : "blue.400"}
        py="20px"
        borderRadius="2xl"
        position="relative"
        mb="20px"
      >
        <Box
          position="absolute"
          px="6px"
          pl="15px"
          top="5px"
          left="0"
          w="full"
          zIndex="2"
          display="flex"
          alignItems="center"
          color="gray.100"
        >
          <div>
            <Link to="/">
            <Text fontSize="2xl" fontWeight="bold">SmartBox</Text>
              {/* <Image
                src="/assets/images/main-logo-white.png"
                h="auto"
                w="90px"
              /> */}
            </Link>
          </div>
          <Spacer />
          <BurgerMenuButton color="white" />
        </Box>
        <Avatar
          border="2px solid white"
          name={deviceData.name}
          src={deviceData.avatar}
          size="2xl"
          mb="10px"
        />
        <Box>
          <Button
            as="label"
            htmlFor="avatar_file"
            mr="10px"
            leftIcon={<BsUpload />}
          >
            Upload avatar
          </Button>
          <input
            onChange={handleAvatarChange}
            type="file"
            id="avatar_file"
            name="avatar_file"
            style={{ display: "none" }}
          />
          <ChakraColorPicker
            value={deviceData.bg_color ? deviceData.bg_color : "blue.500"}
            onChange={handleColorChange}
          />
        </Box>
      </Box>

      <Box>
        <FormControl mb="20px">
          <FormLabel htmlFor="name">Full Name</FormLabel>
          <Input
            placeholder="Full Name"
            variant="filled"
            name="name"
            value={deviceData.name}
            onInput={deviceDataPropChange}
          />
        </FormControl>
        <FormControl mb="20px">
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input
            placeholder="Title"
            variant="filled"
            name="title"
            value={deviceData.title}
            onInput={deviceDataPropChange}
          />
        </FormControl>
        <FormControl mb="20px">
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea
            placeholder="description"
            variant="filled"
            name="description"
            value={deviceData.description}
            onInput={deviceDataPropChange}
          />
        </FormControl>
      </Box>

      {embeddedVideo && <VideoEmbedEdit videoData={embeddedVideo} />}
      {showExplainer && (
        <Center>
          <Text color="gray.600">Tap on any icon below to edit</Text>
        </Center>
      )}
      <Box display="flex" flexWrap="wrap" justifyContent="center" pb="70px">
        {socials.map((social, index) => {
          if (social.provider != "video") {
            return (
              <SocialIcon
                social={social}
                onClick={() => setActiveEditLink(social.id)}
                editMode={true}
                key={social.id}
              />
            );
          }
        })}
      </Box>

      <Button
        rightIcon={<VscAdd />}
        onClick={() => setIsDrawerOpen(true)}
        colorScheme="blue"
        color="white"
        position="absolute"
        bottom="20px"
        right="10px"
      >
        Add Social
      </Button>

      <SocialIconDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        deviceId={id}
      />

      <SocialIconEditDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setActiveEditLink(null)}
        editSocialId={activeEditLink}
      />
    </Box>
  );
};

export default EditDevice;
