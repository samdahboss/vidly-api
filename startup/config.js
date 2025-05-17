import config from "config";

const checkConfig = () => {
  if (!config.get("jwt_private_key")) {
    throw new Error("FATAL ERROR: jwt_private_key is not defined");
  }
};

export default checkConfig;