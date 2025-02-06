import { useContext } from "react";
import { LangburpContext } from "../contexts/LangburpContext";

export const useLangburp = () => {
  const context = useContext(LangburpContext);
  if (!context) {
    throw new Error("useLangburp must be used within a LangburpProvider");
  }
  return context;
}; 