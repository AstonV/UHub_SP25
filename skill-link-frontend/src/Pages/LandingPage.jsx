import { Box, Flex, Grid, Heading, Icon, Image, Input, Separator, Text, Textarea } from "@chakra-ui/react";
import { APP_NAME } from "@/config.js";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";
import { ColorModeButton } from "@/components/ui/color-mode.jsx";
import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaUsers } from "react-icons/fa6";
import { FaChalkboardTeacher, FaTasks } from "react-icons/fa";
import Logo from "../assets/navLogo.png";
import PM from "../assets/pm.jpg";
import P1 from "../assets/bryan.jpg";
import P2 from "../assets/phat.jpg";
import P3 from "../assets/thu.jpg";
import P4 from "../assets/rommel.jpg";
import { HashLink } from "react-router-hash-link";
import { Avatar } from "@/components/ui/avatar.jsx";
import api from "@/services/api.js";
import { toaster } from "@/components/ui/toaster.jsx";


const LandingPage = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setFormData({ name: '', email: '', message: '' });
            toaster.success({
                title: 'Success',
                description: 'Email Sent Successfully!',
                status: 'success',
            })
            const response = await api.post('/email/contact', formData);
            console.log(response);
            

        } catch (err) {
            console.error(err);
        }

    }

    const bgImgUrl = "https://pub-static.fotor.com/assets/bg/bf9a415f-b758-4c0d-a820-334370772ec3.jpg";

    const teamMembers = [
        {
            name: "Bryan",
            location: "California, U.S",
            image: P1,
            bio: "Co-initiator",
            email: "bryan@gmail.com",
        },
        {
            name: "Phat",
            location: "California, U.S",
            image: P2,
            bio: "Co-initiator",
            email: "phat@gmail.com",
        },
        {
            name: "Thu",
            location: "California, U.S",
            image: P3,
            bio: "Iniciator",
            email: "thu@gmail.com",
        },
        {
            name: "Rommel",
            location: "California, U.S",
            image: P4,
            bio: "Manager",
            email: "rommel@gmail.com",
        },
    ];

    return (
        <Flex h="100vh" w="100vw" justify="start" align="center" direction="column" backgroundImage={`url(${bgImgUrl})`}
            maxHeight="100vh"

            _dark={{ bg: 'gray.900' }}
            scrollBehavior="smooth"
            overflow="auto"
            gap={8}
            bgSize="cover" bgRepeat="no-repeat" bgPosition="center"
        >

            <Flex direction="row" align={'center'} justify="space-between" _dark={{ bg: 'gray.800' }} bg={'white'} p={4}
                borderRadius="md" w={'100%'}>
                <Flex direction="row" align="center" justify="center" p={2} gap={4}>
                    <Image src={Logo} alt={APP_NAME} w={10} h={10} objectFit={'scale-down'} />
                    <Heading as="h1" size="2xl">{APP_NAME}</Heading>
                </Flex>

                {/*    Link for Home,Contatct us, About and Login,SignUp*/}
                <Flex direction="row" align="space-between" p={2} gap={4}>
                    <HashLink to={'#home'}>
                        <Flex direction="row" align="center" justify="center" p={2} borderRadius="md"
                            _hover={{ bg: 'gray.200' }} _active={{ bg: 'gray.300' }} _focus={{ bg: 'gray.300' }}
                            _dark={{ bg: 'gray.800', _hover: { bg: 'gray.700' } }}
                            bg={'white'}>
                            <Text>Home</Text>
                        </Flex>
                    </HashLink>
                    <HashLink to={'#about'}>
                        <Flex direction="row" align="center" justify="center" p={2} borderRadius="md"
                            _hover={{ bg: 'gray.200' }} _active={{ bg: 'gray.300' }} _focus={{ bg: 'gray.300' }}
                            _dark={{ bg: 'gray.800', _hover: { bg: 'gray.700' } }}
                            bg={'white'}>
                            <Text>About</Text>
                        </Flex>
                    </HashLink>
                    <HashLink to={'#contact-us'}>
                        <Flex direction="row" align="center" justify="center" p={2} borderRadius="md"
                            _hover={{ bg: 'gray.200' }} _active={{ bg: 'gray.300' }} _focus={{ bg: 'gray.300' }}
                            _dark={{ bg: 'gray.800', _hover: { bg: 'gray.700' } }}
                            bg={'white'}>
                            <Text>Contact Us</Text>
                        </Flex>
                    </HashLink>

                    <ColorModeButton />
                    <Link to={'/login'}>
                        <Button
                            colorPalette="blue"
                            variant="subtle"
                            size="md"
                        >Login</Button>
                    </Link>
                    <Link to={'/register'}>
                        <Button
                            colorPalette="green"
                            variant="subtle"
                            size="md"
                        >Register</Button>
                    </Link>
                </Flex>
            </Flex>

            {/*    Hero Section*/}
            <section id="home" style={{ width: '100%', height: '100vh' }}>
                <Flex direction="column" align="center" justify="space-around" w="full" h="full"
                    p={4}>
                    {/*    Find Your Perfect Collaborator
                Connect with like-minded individuals to study, work, and manage tasks effectively
                Get Started Now
            */}
                    <Flex direction="column" align="center" justify="center" p={4}>
                        <Heading as="h1" size="4xl">Find Your Perfect Collaborator</Heading>
                        <Text my={3} as="h4" size="xl">Uhub, Teamwork makes the dream work.</Text>
                        <Flex direction="row" align="center" justify="center" p={4} gap={4}>
                            <Link to={'/register'}>
                                <Button
                                    colorPalette="blue"
                                    variant="solid"
                                    size="lg"
                                >Get Started Now</Button>
                            </Link>
                        </Flex>
                    </Flex>

                    {/*    Features 3 Card */}
                    <Flex direction="column" align="center" justify="center" p={4} w="full">
                        <Heading as="h1" size="4xl">Features</Heading>
                        <Grid direction="row" align="center" justify="center" p={4} gap={4}
                            templateColumns="repeat(auto-fit, minmax(200px, 1fr))" w="full">
                            <Flex direction="column" align="center" justify="center" p={4} borderRadius="md"
                                h={'300px'} bg={'white'} _dark={{ bg: 'gray.800' }}>
                                <Icon fontSize="50px" color={'rgba(0,15,255,0.66)'}
                                    _dark={{ color: 'rgba(161,174,255,0.66)' }}>
                                    <FaUsers />
                                </Icon>

                                <Heading my={2} as="h2" size="xl">Connect with Peers</Heading>
                                <Text textAlign={'center'}>Find and connect with people who share your interests and goals</Text>
                            </Flex>
                            <Flex direction="column" align="center" justify="center" p={4} borderRadius="md"
                                h={'300px'} bg={'white'} _dark={{ bg: 'gray.800' }}>
                                <Icon fontSize="50px" color={'rgba(0,15,255,0.66)'}
                                    _dark={{ color: 'rgba(161,174,255,0.66)' }}>
                                    <FaTasks />
                                </Icon>
                                <Heading my={2} as="h2" size="xl">Project Management</Heading>
                                <Text textAlign={'center'}>
                                    Organize and manage your projects with our intuitive project management tools
                                </Text>
                            </Flex>
                            <Flex direction="column" align="center" justify="center" p={4} borderRadius="md"
                                h={'300px'} bg={'white'} _dark={{ bg: 'gray.800' }}>
                                <Icon fontSize="50px" color={'rgba(0,15,255,0.66)'}
                                    _dark={{ color: 'rgba(161,174,255,0.66)' }}>
                                    <FaChalkboardTeacher />
                                </Icon>
                                <Heading my={2} as="h2" size="xl">
                                    Collaborate Learning
                                </Heading>
                                <Text textAlign={'center'}>
                                    Engage in collaborative learning with your peers to enhance your skills
                                </Text>
                            </Flex>
                        </Grid>
                    </Flex>
                </Flex>

            </section>
            {/*About Section */}
            <section id="about" style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Flex direction="row" align="center" justify="center" w="full" p={4} minH="50vh" bg={'gray.100'}
                    _dark={{ bg: 'gray.800' }}
                    maxW="90%" borderRadius="md" gap={4}>
                    <Image src={PM} alt="Project Management" w="50%"
                        h="full" borderRadius="md" />
                    <Flex direction="column" align="center" justify="start" w="50%" p={6}>
                        <Heading as="h1" size="4xl">About Us</Heading>
                        <Text mb={6} fontSize="lg">
                            Welcome to {APP_NAME}, your go-to platform for collaborative learning and project
                            management.
                        </Text>
                        <Text fontSize="lg">
                            At {APP_NAME}, we believe in the power of collaboration to achieve great things. Whether
                            you're
                            a student looking to team up with peers, a professional seeking efficient project management
                            tools,
                            or someone who simply wants to grow and learn with like-minded individuals, we've got you
                            covered.
                        </Text>
                    </Flex>
                </Flex>
            </section>

            {/*Contact Us Section */}
            <section id="contact-us" style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Flex direction="column" align="center" justify="start" w="full" p={8} minH="50vh" bg={'gray.100'}
                    _dark={{ bg: 'gray.800' }}
                    maxW="90%" borderRadius="md" gap={2}>
                    <Heading as="h1" size="md" >Our Support Team</Heading>

                    <Text w={'60%'} fontSize="4xl" textAlign="center">
                        Talk to Real People
                    </Text>
                    <Text mb={2} w={'60%'} fontSize="lg" textAlign="center">
                        Amazing things happen when great minds come together. Meet the team behind {APP_NAME}. Our
                        Support Team is always ready to assist you. Amazing things happen when great minds come together. Meet the team behind {APP_NAME}. Our
                        Support Team is always ready to assist you.
                    </Text>
                    <Flex direction="row" align="center" justify="center" w="full" gap={4}>
                        {teamMembers.map((member, index) => (
                            <Flex direction="column" align="center" justify="start" px={4} py={2} borderRadius="md"

                                h={'450px'} w={'250px'} bg={'white'} _dark={{ bg: 'gray.800' }} key={index}>
                                <Image src={member.image} alt={member.name} w="100px" h="100px" borderRadius="full" />
                                <Heading my={0} as="h1" size="xl">{member.name}</Heading>
                                <Text>{member.location}</Text>
                                <Link
                                    to={`mailto:${member.email}`}
                                >
                                    <Text>{member.email}</Text>
                                </Link>
                                <Text textAlign={'center'} fontFamily={'Times-New-Roman'} fontSize={'0.8em'} as="p">
                                    {member.bio}
                                </Text>

                            </Flex>
                        ))}

                    </Flex>

                </Flex>
                <Flex direction="column" align="center" justify="start" w="full" p={8} minH="50vh" bg={'gray.100'}
                    _dark={{ bg: 'gray.800' }}
                    maxW="90%" borderRadius="md" gap={4}>
                    <Heading as="h1" size="2xl" mb={4}>Contact Us</Heading>
                    <Text mb={6} fontSize="lg">Have questions or need assistance? Reach out to us!</Text>
                    <Flex direction="column" w="full" maxW="600px" gap={4}>
                        <Input placeholder="Your Name" size="lg" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        <Input placeholder="Your Email" size="lg" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        <Textarea placeholder="Your Message" size="lg" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                        <Button colorPalette="blue" variant="solid" size="lg"
                            onClick={handleSubmit}
                        >Send Message</Button>
                    </Flex>
                </Flex>
            </section>

            {/*    Footer*/
            }
            <Flex direction="column" align="center" justify="center" w="full" p={4} bg={'gray.800'} color={'white'}>
                <Text>© 2025 {APP_NAME}, All Rights Reserved</Text>
                <Flex direction="row" align="center" justify="center" p={2} gap={4}>
                    {/*    FB, Twitter, LinkedIn, Instagram*/}
                    <Link to={'http://www.facebook.com'}>
                        <FaFacebook />
                    </Link>

                    <Link to={'http://www.twitter.com'}>
                        <FaTwitter />

                    </Link>
                    <Link to={'http://www.linkedin.com'}>

                        <FaLinkedin />
                    </Link>

                    <Link to={'http://www.instagram.com'}>
                        <FaInstagram />

                    </Link>


                </Flex>

            </Flex>
        </Flex>
    )
}

export default LandingPage;