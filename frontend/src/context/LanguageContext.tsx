import react, { createContext,useContext, useState, ReactNode, Children } from 'react';
import { translations } from '../locals'; // Assuming your translations are defined here

// Define supported languages
type Language = 'en' | 'de';

// Define the shape of the context
interface LanguageContextType {
    language : Language;
    setLanguage: (language: Language) => void;
    t : any; // Translation object for the current language
}

// create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component to warp the app
export const LanguageProvider = ({ children}: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('de'); // Default language is German

    // get the translation object for the current language
    const t = translations[language];

    return (
          <LanguageContext.Provider  value={{ language, setLanguage, t }}>
            {children}
            </LanguageContext.Provider>
    );
};
 // Custom hook for consuming the language context
 export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error ('useLanguage must be used within a LnaguageProvider');
    }
    return context;
 }