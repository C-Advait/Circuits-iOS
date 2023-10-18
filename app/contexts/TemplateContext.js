import React, { createContext, useContext, useState } from "react";
import { SortCriteria } from "../classes/SortCriteria";

const TemplateContext = createContext();

export const useTemplateContext = () => {
  return useContext(TemplateContext);
};

export const TemplateProvider = ({ children }) => {
  const [selectedTemplateID, setSelectedTemplateID] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState("Custom");
  const [sortOption, setSortOption] = useState(SortCriteria.RECENTLY_COMPLETED);

  return (
    <TemplateContext.Provider
      value={{
        selectedTemplateID,
        setSelectedTemplateID,
        selectedTemplate,
        setSelectedTemplate,
        sortOption,
        setSortOption,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};
