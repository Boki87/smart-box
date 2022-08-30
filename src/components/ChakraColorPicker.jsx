import {useState} from 'react'
import {HStack, Text, Popover, PopoverTrigger, Button,PopoverContent, PopoverArrow, PopoverBody, PopoverHeader, PopoverCloseButton, Box, Divider} from '@chakra-ui/react'
import {BsUpload, BsTrash} from 'react-icons/bs'
import {uploadImage, updateDeviceData} from '../lib/firebase'
import { compressImage } from "../lib/utils";

const defaultColors = [
    'gray.400',
    'red.400',
    'orange.400',
    'yellow.400',
    'green.400',
    'teal.400',
    'blue.400',
    'cyan.400',
    'purple.400',
    'pink.400',
]


const ChakraColorPicker = ({value, colors = defaultColors, onChange, onBgChange, id}) => {

    const [selectedColor, setSelectedColor] = useState(value)
    const [isOpen, setIsOpen] = useState(false)
    const [updating, setUpdating] = useState(false)


    function setColor(color) {
        onChange(color)
        setIsOpen(false)
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

    function removeBg() {
        updateData(id, { bg_image: "" });
        onBgChange("")
    }


    async function handleBgChange(e) {
        let bgImage = e.target.files[0];
        if (!bgImage) return;

        try {
        setUpdating(true);

        let compressedBg = await compressImage(bgImage);
        bgImage = compressedBg;

        let res = await uploadImage('backgrounds', bgImage, id);
        updateData(id, { bg_image: res });
        onBgChange(res)
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

    return (
        <Popover isOpen={isOpen} closeOnBlur={true} closeOnEsc={true}>
            <PopoverTrigger>
                <Button onClick={() => {setIsOpen(!isOpen)}}>
                    {/* <Text>Background: </Text> */}
                    <Box bg={value} w="20px" h="20px" ml="0px" borderRadius="full"></Box>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton onClick={() => {setIsOpen(false)}}/>
                <PopoverHeader>Pick a color</PopoverHeader>
                <PopoverBody display="flex" flexWrap="wrap" justifyContent="center">
                
                    {colors.map(color => (<Box onClick={() => setColor(color)} minW="50px" minH="50px" m="3px" borderRadius="md" bg={color} cursor="pointer" key={color}></Box>))}

                    <Divider my="10px"/>

                    <HStack>
                        <Button
                            as="label"
                            htmlFor="bg_file"
                            mr="10px"
                            leftIcon={<BsUpload />}
                            isLoading={updating}
                        >
                            Upload bg image
                        </Button>
                        <Button 
                            onClick={removeBg}
                            isLoading={updating}
                        ><BsTrash /></Button>
                        <input
                            onChange={handleBgChange}
                            type="file"
                            id="bg_file"
                            name="bg_file"
                            style={{ display: "none" }}
                        />
                    </HStack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}

export default ChakraColorPicker