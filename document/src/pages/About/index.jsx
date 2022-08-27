import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import config from "../../components/config";
const About = () => {
  const [node, setNode] = useState(null);

  function HTMLDecode(text) {
    var temp = document.createElement("div");
    temp.innerHTML = text;
    var output = temp.innerText || temp.textContent;
    temp = null;
    return output;
  }
  useEffect(() => {
    axios.get(`${config.baseUrl}/yiyan/index.php`, {}).then((res) => {
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
      {node}
    </div>
  );
};
export default About;
