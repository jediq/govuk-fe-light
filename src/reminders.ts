module.exports = {
  name: "Get an annual MOT reminder",
  targetUrl: "https://someurl.gov.uk",
  gdsPhase: "alpha",
  firstPage: "vrn",
  successMessage: "Your details where saved correctly",
  failureMessage: "Your details failed to be saved",
  cookieSecret: "8y/B?D(G+KbPeShVmYq3t6w9z$C&F)H@",
  pages: [
    {
      id: "vrn",
      description: "What is the vehicle’s registration number?",
      nextPage: () => "channel-selection",
      preRequisiteData: [],
      items: [
        {
          id: "vrnField",
          type: "text",
          label: "Registration number (number plate)",
          hint: "For example, CU57ABC",
          width: "one-third",
          validator:
            "(?<Current>^[A-Z]{2}[0-9]{2}[A-Z]{3}$)|(?<Prefix>^[A-Z][0-9]{1,3}[A-Z]{3}$)|(?<Suffix>^[A-Z]{3}[0-9]{1,3}[A-Z]$)|(?<DatelessLongNumberPrefix>^[0-9]{1,4}[A-Z]{1,2}$)|(?<DatelessShortNumberPrefix>^[0-9]{1,3}[A-Z]{1,3}$)|(?<DatelessLongNumberSuffix>^[A-Z]{1,2}[0-9]{1,4}$)|(?<DatelessShortNumberSufix>^[A-Z]{1,3}[0-9]{1,3}$)",
          error: "Enter the vehicle’s registration"
        }
      ],
      preValidation: [
        {
          id: "vehicleData",
          url:
            "https://uk1.ukvehicledata.co.uk/api/datapackage/MotHistoryAndTaxStatusData?v=2&api_nullitems=1&auth_apikey=21f37715-3198-474c-9fb2-ed1cdfc47604&key_VRM={{context.data.vrnField}}",

          debugUrl: "http://localhost:3000/assets/YY09DEF.json",
          headers: {
            accept: "application/json"
          }
        }
      ],
      validation: {
        validator: context => {
          return context.data.vehicleData && context.data.vehicleData[0].registration;
        },
        error: "We don't hold information about this vehicle"
      }
    },
    {
      id: "channel-selection",
      description: "What type of reminder do you want to get?",
      preRequisiteData: ["vrnField"],
      nextPage(context) {
        if (context.data.channelField === "Email") {
          return "email";
        } else {
          return "phone-number";
        }
      },
      items: [
        {
          id: "channelField",
          type: "radio",
          options: ["Email", "Text to my mobile phone"],
          validator: ".+",
          error: "Choose one reminder you want"
        }
      ]
    },
    {
      id: "email",
      description: "What is your email address?",
      preRequisiteData: ["vrnField", "channelField"],
      nextPage: () => "tax-reminder",
      items: [
        {
          id: "contactField",
          type: "text",
          label: "Email address",
          hint: "Your reminder will be sent here",
          width: "one-third",
          validator: "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$",
          error: "Enter your email address"
        }
      ]
    },
    {
      id: "phone-number",
      description: "What is your mobile number?",
      preRequisiteData: ["vrnField", "channelField"],
      nextPage: () => "tax-reminder",
      items: [
        {
          id: "contactField",
          type: "text",
          label: "Mobile phone number",
          hint: "Your reminder will be sent here",
          width: "one-third",
          validator: "^d{5} ?d{3} ?d{3}$",
          error: "Enter your mobile number"
        }
      ]
    },
    {
      id: "tax-reminder",
      description: "Do you also want a reminder about the vehicle tax?",
      preRequisiteData: ["vrnField"],
      nextPage: () => "confirmation",
      items: [
        {
          id: "taxField",
          label: "Tax reminder?",
          type: "radio",
          options: ["Yes", "No"],
          validator: ".+",
          error: "Choose if you'd like a tax reminder"
        }
      ]
    }
  ],
  confirmation: {
    description: "Make sure the vehicle and your contact details are correct.",
    preRequisiteData: ["vrnField", "channelField", "contactField"],
    groups: [
      {
        title: "Personal details",
        items: ["contactField", "taxField"],
        ancillary: []
      },
      {
        title: "Vehicle details",
        items: ["vrnField"],
        ancillary: [
          {
            name: "Make",
            location: "data.vehicleData[0].make"
          }
        ]
      }
    ]
  }
};
