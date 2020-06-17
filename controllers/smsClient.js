const axios = require("axios");

const tlClient = axios.create({
  baseURL: "https://api.textlocal.in/",
  params: {
    apiKey: "HkNBwMF5ewE-LhwklzHjxndC2yb71t1q4WsdROp4Hx", //Text local api key
    sender: "VISION"
  }
});

const smsClient = {
  sendUserWelcomeMessage: user => {
    var msg = `Your One Time Bookrides Password (OTP) is : `+user.otp+`

- Team Bookrides
POWERED BY VISION TECHNOSOFT`;
    var url = 'https://api.textlocal.in/send/?apikey=HkNBwMF5ewE-LhwklzHjxndC2yb71t1q4WsdROp4Hx&numbers=91'+user.phone+'&sender=VISION&message='+encodeURIComponent(msg);
    // Make a request for a user with a given ID
    axios.get(url)
    .then(function (response) {
    // handle success
    console.log("------ SMS Gateway Response ------");
    console.log(response.data);
    })
    .catch(function (error) {
    // handle error
    console.log(error);
    })
    .finally(function () {

    });   
  },

  sendPartnerWelcomeMessage: user => {
    var msg = `Your OTP for login into bookrides supplier account is : `+user.otp+`
-BookRides`;
    var url = 'https://api.textlocal.in/send/?apikey=HkNBwMF5ewE-LhwklzHjxndC2yb71t1q4WsdROp4Hx&numbers=91'+user.phone+'&sender=VISION&message='+encodeURIComponent(msg);
    // Make a request for a user with a given ID
    axios.get(url)
    .then(function (response) {
    // handle success
    console.log("------ SMS Gateway Response ------");
    console.log(response.data);
    })
    .catch(function (error) {
    // handle error
    console.log(error);
    })
    .finally(function () {
    // always executed
    });   
  },
  sendVerificationMessage: user => {
    if (user && user.phone) {
      const params = new URLSearchParams();
      params.append("numbers", [parseInt("91" + user.phone)]);
      params.append(
        "message",
        `Your iWheels verification code is ${user.verifyCode}`
      );
      tlClient.post("/send", params);
    }
  }
};

module.exports = smsClient;