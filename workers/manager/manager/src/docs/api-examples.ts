export const API_EXAMPLES = {
  teacher: {
    create: {
      name: "Marie Dupont",
      email: "marie@school.com",
      subject: "Mathématiques",
      salaryType: "fixed",
      salaryAmount: 3000,
      schoolId: 1,
    },
    update: {
      name: "Marie Dupont",
      email: "marie@school.com",
      subject: "Physique",
      salaryType: "hourly",
      salaryAmount: 50,
    },
  },
  staff: {
    create: {
      name: "Jean Martin",
      email: "jean@school.com",
      role: "secretary",
      salaryAmount: 2500,
      schoolId: 1,
    },
    update: {
      name: "Jean Martin",
      email: "jean@school.com",
      role: "admin",
      salaryAmount: 3000,
    },
  },
  student: {
    create: {
      name: "Alice Dupont",
      email: "alice@example.com",
      schoolId: 1,
      parentId: 1,
      classId: 1,
    },
    update: {
      name: "Alice Dupont",
      email: "alice@example.com",
      parentId: 2,
      classId: 2,
    },
  },
  parent: {
    create: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+33612345678",
    },
    update: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+33698765432",
    },
  },
};
