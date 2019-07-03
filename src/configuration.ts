module.exports = {
  name: "Example gov.uk service",
  targetUrl: "https://someurl.gov.uk",
  gdsPhase: "alpha",
  firstPage: "page1",
  successMessage: "Your details where saved correctly",
  failureMessage: "Your details failed to be saved",
  cookieSecret: "8y/B?D(G+KbPeShVmYq3t6w9z$C&F)H@",
  pages: [
    {
      id: "page1",
      description: "Page 1",
      nextPage: () => "page2",
      items: [
        {
          id: "field1",
          type: "text",
          label: "Text field 1",
          hint: "For example, CU57ABC",
          width: "one-third",
          validator: ".*",
          error: "Enter some text"
        }
      ]
    },
    {
      id: "page2",
      description: "Page 2",
      preRequisiteData: ["field1"],
      nextPage: () => "page2",
      items: [
        {
          id: "field2",
          type: "text",
          label: "Text field 2",
          hint: "For example, CU57ABC",
          width: "one-third",
          validator: ".*",
          error: "Enter some text"
        }
      ]
    }
  ]
};
