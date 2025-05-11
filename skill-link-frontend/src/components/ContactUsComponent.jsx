import React from 'react';
import { Flex, Heading, Text, Input, Textarea, Button } from "@chakra-ui/react";

const ContactUs = () => {
    return (
        <Flex direction="column" align="center" justify="start" w="full" p={8}>
            <Heading as="h1" size="2xl" mb={4}>Contact Us</Heading>
            <Text mb={6} fontSize="lg">Have questions or need assistance? Reach out to us!</Text>
            <Flex direction="column" w="full" maxW="600px" gap={4}>
                <Input placeholder="Your Name" size="lg" />
                <Input placeholder="Your Email" size="lg" />
                <Textarea placeholder="Your Message" size="lg" />
                <Button colorPalette="blue" variant="solid" size="lg">Send Message</Button>
            </Flex>
        </Flex>
    );
};

export default ContactUs;
