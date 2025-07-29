import React from 'react';
import {Box, Flex, Heading, Image, Input, Stack} from "@chakra-ui/react";
import {Button} from "../components/ui/button.jsx";
import {Field} from "../components/ui/field.jsx";
import { Toaster, toaster } from "../components/ui/toaster"
import Logo from "../assets/logo.png";
import api from "@/services/api.js";
import {Link, useNavigate} from "react-router-dom";
import {login, register} from "@/services/authenticationService.js";
import {APP_NAME} from "@/config.js";



const Register = () => {
    const navigate = useNavigate()
    const [userCredentials, setUserCredentials] = React.useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [userCredentialsError, setUserCredentialsError] = React.useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handleSubmit =async (event) =>  {
        //check if email is empty and set error message
        if(userCredentials.email === ''){
            setUserCredentialsError({...userCredentialsError, email: 'Email is required'})
        }
        //check if password is empty and set error message
        if(userCredentials.password === ''){
            setUserCredentialsError({...userCredentialsError, password: 'Password is required'})
        }
        if (userCredentials.name === '') {
            setUserCredentialsError({...userCredentialsError, name: 'Name is required'})
        }
        if (userCredentials.confirmPassword === '') {
            setUserCredentialsError({...userCredentialsError, confirmPassword: 'Confirm Password is required'})
        }
        if (userCredentials.password !== userCredentials.confirmPassword) {
            setUserCredentialsError({...userCredentialsError, confirmPassword: 'Passwords do not match'})
        }
        if(Object.values(userCredentialsError).some(x => (x !== null && x !== ''))){
            return
        }

        //if email and password are not empty, make a POST request to the server
        const res = await register(userCredentials.name,userCredentials.email, userCredentials.password)
        if(res){
            toaster.success({
                title: 'Success',
                description: 'Registered successfully',
                status: 'success',
            })
            navigate('/login')

        }
    };

    return (
        <Box
            minH="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
        >
            <Toaster />

            <Box
                maxW="md"
                w="full"
                boxShadow="md"
                borderRadius="md"
                p={6}
            >
                <Flex textAlign="center" alignItems={"center"} justifyContent={"center"} mb={6}>
                    <Image src={Logo} alt="Skill Link Logo" w="100px" />
                </Flex>
                {/*Home ICon*/}
                <Flex textAlign="center" alignItems={"center"} justifyContent={"center"} mb={6}>
                    <Link to="/">
                        <Button variant="ghost" colorPalette="blue" size="md">
                            Home
                        </Button>
                    </Link>
                </Flex>
                <Heading as="h1" size="4xl" mb={6} textAlign="center">
                    Welcome to {APP_NAME}
                </Heading>
                <Heading as="h2" size="lg" mb={6} textAlign="center">
                    Create an account
                </Heading>
                    <Stack spacing={4}>
                        <Field label="Name" invalid={userCredentialsError.name} errorText={userCredentialsError.name} required>
                            <Input placeholder="Your Name" onChange={(e) => setUserCredentials({...userCredentials, name: e.target.value})} value={userCredentials.name} />
                        </Field>
                        <Field label="Email" invalid={userCredentialsError.email}  errorText={userCredentialsError.email} required>
                            <Input placeholder="me@example.com"  onChange={(e) => setUserCredentials({...userCredentials, email: e.target.value})} value={userCredentials.email} />
                        </Field>
                        <Field label="Password" invalid={userCredentialsError.password} errorText={userCredentialsError.password} required>
                            <Input type="password" placeholder="*******" onChange={(e) => setUserCredentials({...userCredentials, password: e.target.value})} value={userCredentials.password} />
                        </Field>
                        <Field label="Confirm Password" invalid={userCredentialsError.confirmPassword} errorText={userCredentialsError.confirmPassword} required>
                            <Input type="password" placeholder="*******" onChange={(e) => setUserCredentials({...userCredentials, confirmPassword: e.target.value})} value={userCredentials.confirmPassword} />
                        </Field>
                        <Button type="submit" variant="surface" colorPalette="green" size="lg" fontSize="md" onClick={handleSubmit}>
                            Register
                        </Button>
                        <Button variant="ghost" colorPalette="blue" size="md" onClick={() => navigate('/login')}>
                            Already have an account? Login
                        </Button>
                    </Stack>
            </Box>
        </Box>
    );
};

export default Register;