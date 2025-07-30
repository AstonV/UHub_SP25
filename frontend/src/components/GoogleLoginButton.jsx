import React from "react";
import {GoogleOAuthProvider, GoogleLogin,} from "@react-oauth/google";
import {Button} from "@/components/ui/button.jsx";
import {useColorMode} from "@/components/ui/color-mode.jsx";
import {loginGoogle} from "@/services/authenticationService.js";
import {toaster} from "@/components/ui/toaster.jsx";
import {useNavigate} from "react-router-dom";

const GoogleLoginButton = () => {

    const colorMode = useColorMode();
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        console.log("Encoded JWT ID token:", credentialResponse.credential);
        const res = await loginGoogle(credentialResponse.credential, credentialResponse.clientId);
        if (res) {
            toaster.success({
                title: 'Success',
                description: 'Logged in successfully',
                status: 'success',
            })
            const role = res.user.role;
            navigate(role === 'admin' ? '/admin-dashboard' : '/dashboard')
        } else {
            toaster.error({
                title: 'Error',
                description: 'Failed to login',
                status: 'error',
            });
        }
    };

    const handleError = () => {
        toaster.error({
            title: 'Error',
            description: 'Failed to login',
            status: 'error',
        });
    };

    // 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

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH}>
            <GoogleLogin
                // theme="filled_black" //filled_blue
                theme={colorMode.colorMode === "light" ? "filled_blue" : "filled_black"}
                shape="pill"
                onSuccess={handleSuccess}
                onError={handleError}
            />
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;
