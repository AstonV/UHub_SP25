import React from 'react';
import { Flex, Heading, Text } from "@chakra-ui/react";
import {APP_NAME} from "@/config.js";

const About = () => {
    return (
        <Flex direction="column" align="center" justify="start" w="full" p={8}>
            <Heading as="h1" size="2xl" mb={4}>About Us</Heading>
            <Text mb={6} fontSize="lg">
                Welcome to {APP_NAME}, your go-to platform for collaborative learning and project management.
            </Text>
            <Text fontSize="lg">
                At {APP_NAME}, we believe in the power of collaboration to achieve great things. Whether you're
                a student looking to team up with peers, a professional seeking efficient project management tools,
                or someone who simply wants to grow and learn with like-minded individuals, we've got you covered.
            </Text>
        </Flex>
    );
};

export default About;
