import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { logger } from '../../utils/logger';

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '378551540056-4uh26d8e3ifgsdb1fvb2uqm0ee26nhbf.apps.googleusercontent.com';

interface GoogleLoginButtonProps {
  onGoogleLogin: (credential?: string) => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function GoogleLoginButton({
  onGoogleLogin,
  disabled,
  fullWidth,
}: GoogleLoginButtonProps) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className={`w-full ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
        {fullWidth ? (
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              onGoogleLogin(credentialResponse.credential);
            }}
            onError={() => {
              logger.error('Google Login Failed');
              onGoogleLogin(undefined);
            }}
            useOneTap={false}
            type="standard"
            size="large"
            shape="rectangular"
            theme="outline"
            text="signin_with"
            width="400"
            logo_alignment="center"
          />
        ) : (
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              onGoogleLogin(credentialResponse.credential);
            }}
            onError={() => {
              logger.error('Google Login Failed');
              onGoogleLogin(undefined);
            }}
            useOneTap={false}
            type="icon"
            size="small"
            shape="circle"
            theme="filled_blue"
          />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}
