import React from "react";
import AppHeader from "../AppHeader";
import Feed from "../Feed";

const App = () => {
  return (
    <>
      <AppHeader main />
      <div className="container mx-auto mt-4">
        <Feed />
      </div>
    </>
  );
};

export default App;
