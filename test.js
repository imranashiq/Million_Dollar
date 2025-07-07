const axios = require("axios");
const qs = require("qs");
const crypto = require("crypto");
const randomfinger = require("./browserdata2");

const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiI4N2Y1ZDQxMi00ZWJhLTRjOTctOTk4NS04MDlhZDM0ZWQ0MmQiLCJpYXQiOjE3NTE3MTkyMDF9.n9-4jZb91iKAs-6StR9f-UJGcQXJZxP4jjtdvOtZpTg";

const commonHeaders = {
  "Content-Type": "application/x-www-form-urlencoded",
  Authorization: token,
  Accept: "application/json, text/plain, */*",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) adspower_global/7.6.3 Chrome/138.0.7204.35 Electron/37.1.0 Safari/537.36 isGlobal adspower/7.6.3",
  Origin: "https://app-global.adspower.net",
};

const runSingleOpenBrowser = async () => {
  const proxy =
    "b2b-s1.liveproxies.io:7383:LV88332086-lv_us-291227:eGPbgUwJLuOl4FqHWJ9s";
  const browserId = crypto.randomBytes(4).toString("hex");
  const acc_id = (Math.floor(Math.random() * 900) + 100).toString(); // 3-digit string

  try {
    console.log(`\n🚀 Starting openBrowser for proxy: ${proxy}`);

    const browserPayload = qs.stringify({
      info: JSON.stringify(randomfinger),
    });

    const res = await axios.post(
      "http://127.0.0.1:20725/api/openBrowserV3",
      browserPayload,
      {
        headers: {
          ...commonHeaders,
          "Content-Length": Buffer.byteLength(browserPayload),
        },
      }
    );
    console.log("res", res.data);

    console.log(`✅ Browser launched: ${browserId}`);
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
  }
};

runSingleOpenBrowser();
