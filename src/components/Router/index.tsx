import { Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import App from "../App";
import Landing from "../Landing";

const Loading = () => (
  <p className="p-4 w-full h-full text-center">Loading...</p>
);

export const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path="/app" exact component={App} />
          <Route path="/" exact component={Landing} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};