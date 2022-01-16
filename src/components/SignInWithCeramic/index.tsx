import { useCeramic } from "use-ceramic";
import { useEffect, useState } from "react";

function SignInWithCeramic() {
  const ceramic = useCeramic();
  const [authenticated, setAuthenticated] = useState(ceramic.isAuthenticated);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    const subscription = ceramic.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        setAuthenticated(isAuthenticated);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  });

  const handleLogin = async () => {
    try {
      setProgress(true);
      await ceramic.authenticate();
      await ceramic.idx.get("basicProfile");
    } catch (e) {
      console.error(e);
    } finally {
      setProgress(false);
    }
  };

  const renderButton = () => {
    if (progress) {
      return (
        <>
          <a>Connecting...</a>
        </>
      );
    } else {
      return (
        <>
          <a onClick={handleLogin}>Ceramic identity</a>
        </>
      );
    }
  };

  if (authenticated) {
    return (
      <>
        {/* <p>
          Your DID: <code>{ceramic.did.id}</code>
        </p> */}
        <a>Identity connected</a>
        {/* <UsernameIDX /> */}
      </>
    );
  } else {
    return <>{renderButton()}</>;
  }
}

export default SignInWithCeramic;
