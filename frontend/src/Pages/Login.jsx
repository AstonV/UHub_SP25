import React from 'react';
import {Box, Flex, Heading, Image, Input, Stack, Text} from "@chakra-ui/react";
import {Button} from "../components/ui/button.jsx";
import {Field} from "../components/ui/field.jsx";
import { Toaster, toaster } from "../components/ui/toaster"
import Logo from "../assets/logo.png";
import api from "@/services/api.js";
import {Link, useNavigate} from "react-router-dom";
import {login} from "@/services/authenticationService.js";
import GoogleLoginButton from "@/components/GoogleLoginButton.jsx";
import {APP_NAME} from "@/config.js";



const Login = () => {
    const navigate = useNavigate()
    const [userCredentials, setUserCredentials] = React.useState({
        email: '',
        password: ''
    })
    const [userCredentialsError, setUserCredentialsError] = React.useState({
        email: '',
        password: ''
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
        //if email and password are not empty, make a POST request to the server
        const res = await login(userCredentials.email, userCredentials.password)
        if(res){
            toaster.success({
                title: 'Success',
                description: 'Logged in successfully',
                status: 'success',
            })
            const userRole = res.user.role;
            navigate(userRole === 'admin' ? '/admin-dashboard' : '/dashboard')

        } else {
            toaster.error({
                title: 'Error',
                description: 'Failed to login',
                status: 'error',
            });
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

                <Heading as="h1" size="4xl" mb={6} textAlign="center">
                    Welcome to {' '}
                    <Link to="/">
                        <Text as="span" color="blue.500">{APP_NAME}</Text>
                    </Link>
                </Heading>
                <Flex textAlign="center" justify={'center'} align={'center'}>
                    <Image src={Logo} alt="Skill Link Logo" />
                </Flex>
                <Heading as="h1" size="lg" mb={6} textAlign="center">
                    Login to your account
                </Heading>
                    <Stack spacing={4}>
                        <Field label="Email" invalid={userCredentialsError.email}  errorText={userCredentialsError.email} required>
                            <Input placeholder="me@example.com"  onChange={(e) => setUserCredentials({...userCredentials, email: e.target.value})} value={userCredentials.email} />
                        </Field>
                        <Field label="Password" invalid={userCredentialsError.password} errorText={userCredentialsError.password} required>
                            <Input type="password" placeholder="*******" onChange={(e) => setUserCredentials({...userCredentials, password: e.target.value})} value={userCredentials.password} />
                        </Field>
                        <Button type="submit" variant="surface" colorPalette="blue" size="lg" fontSize="md" onClick={handleSubmit}>
                            Login
                        </Button>
                        <GoogleLoginButton />

                        <Button variant="ghost" colorPalette="green" size="md" onClick={() => navigate('/register')}>
                            Don't have an account? Register
                        </Button>
                    </Stack>
            </Box>
        </Box>
    );
};

export default Login;