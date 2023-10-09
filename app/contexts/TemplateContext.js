import React, { createContext, useContext, useState } from "react";

const TemplateContext = createContext();

export const useTemplate = () => {
  return useContext(TemplateContext);
};

export const TemplateProvider = ({ children }) => {
  const [selectedTemplateID, setSelectedTemplateID] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState("Custom");

  return (
    <TemplateContext.Provider
      value={{
        selectedTemplateID,
        setSelectedTemplateID,
        selectedTemplate,
        setSelectedTemplate,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};
