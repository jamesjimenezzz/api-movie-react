import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import StarRating from "./StarRating";

/*function Test() {
  const [testRating, setTestRating] = useState(0);

  return (
    <div>
      <StarRating color="blue" onTestRate={setTestRating} />
      <p>This movie is {testRating} star rating</p>
    </div>
  );
}

<StarRating
      maxRating={5}
      messages={["Bad", "Okay", "Good", "Very Good", "Excellent"]}
    />
    <StarRating maxRating={10} color="red" />
    <Test />
*/

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
