export const generateSchoolCode = (
    school_name: string,
    registration_number: string,
    establishment_year: string
  ): string => {
    const namePart = school_name.replace(/\s+/g, "").slice(0, 2).toUpperCase();
    const regPart = registration_number.slice(-2).toUpperCase();
    const yearPart = establishment_year.slice(-2);
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const school_code = `${namePart}${regPart}${yearPart}${randomSuffix}`.slice(0, 10);
    return school_code;
  };
  

