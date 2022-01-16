import React, { useState } from "react";
import AppHeader from "../AppHeader";
import Feed from "../Feed";
import { NetworkAlert } from "../NetworkAlert/NetworkAlert";

const App = () => {
  const [feed, setFeed] = useState("main");
  const handleFeedChange = (feed: string) => {
    setFeed(feed);
  };
  return (
    <>
      <AppHeader main onFeedChange={handleFeedChange} feed={feed} />
      <div className="container mx-auto sticky top-24 bg-white/30 text-center backdrop-blur-sm">
        <NetworkAlert />
      </div>
      <div className="container mx-auto mt-4">
        <Feed feedType={feed} />
      </div>
    </>
  );
};

export default App;
