import React, { useState, useEffect } from "react";
import axios from "axios";
const About = () => {
  const devUrl = "/api";
  const productionUrl = "https://v.api.aa1.cn/api";
  const [node, setNode] = useState(undefined);

  function HTMLDecode(text) {
    var temp = document.createElement("div");
    temp.innerHTML = text;
    var output = temp.innerText || temp.textContent;
    temp = null;
    return output;
  }
  useEffect(() => {
    let baseUrl =
      process.env.NODE_ENV === "production" ? productionUrl : devUrl;
    axios.get(`${baseUrl}/yiyan/index.php`, {}).then((res) => {
      console.log(res.data);
      setNode(HTMLDecode(res.data));
    });
  }, []);

  return (
    <div
      style={{
        fontSize: "24px",
        minHeight: "calc(100vh - 150px)",
        lineHeight: "calc(100vh - 150px)",
        textAlign: "center",
      }}
    >
      {node ? node : "你之所在，便是我心归处。"}
    </div>
  );
};
export default About;
