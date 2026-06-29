import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation
    navHome: "Home",
    navEvents: "Events",
    navMyRegistrations: "My Registrations",
    navAdminDashboard: "Admin Dashboard",
    navAbout: "About",
    navContact: "Contact",
    navLogin: "Login",
    navSignup: "Sign Up",
    navLogout: "Log Out",
    
    // Auth & General
    email: "Email Address",
    password: "Password",
    fullName: "Full Name",
    confirmPassword: "Confirm Password",
    role: "Role",
    student: "Student",
    admin: "Admin",
    welcome: "Welcome",
    
    // Event Fields
    title: "Title",
    description: "Description",
    category: "Category",
    date: "Date",
    time: "Time",
    venue: "Venue",
    organiser: "Organiser",
    seats: "Seats",
    deadline: "Deadline",
    tags: "Tags",
    bannerUrl: "Banner Image URL",
    
    // Actions
    btnRegister: "Register Now",
    btnCancel: "Cancel Registration",
    btnSubmit: "Submit",
    btnSave: "Save Changes",
    btnDelete: "Delete",
    btnEdit: "Edit",
    btnDownload: "Download Ticket",
    btnDownloadCert: "Download Certificate",
    btnBookmark: "Bookmark",
    btnShare: "Share Event",
    btnBack: "Back",
    
    // Page Content
    homeHeroTitle: "Ignite Your Campus Life",
    homeHeroSubtitle: "Discover and register for the most exciting workshops, hackathons, sports matches, and cultural festivals happening around you.",
    featuredEvents: "Featured Events",
    allCategories: "Browse Categories",
    upcomingCount: "Upcoming Events",
    totalSeats: "Total Seats",
    availableSeats: "Seats Available",
    seatsLeft: "seats left",
    eventStatus: "Event Status",
    countdown: "Registration Closes In",
    
    // Registration Form
    regFormTitle: "Event Registration",
    rollNumber: "Roll Number",
    phone: "Phone Number",
    department: "Department",
    selectDept: "Select Department",
    regSuccess: "Registration Successful!",
    regSuccessSub: "A confirmation email containing your QR Code ticket has been dispatched.",
    
    // My Registrations Page
    myRegTitle: "My Registrations",
    myRegSearchDesc: "Enter your email address to retrieve your active event registrations and tickets.",
    noRegs: "No registrations found. Sign up for events from the list!",
    searchBtn: "Search",
    
    // Admin Dashboard
    adminStats: "Quick Statistics",
    totalRegistrations: "Total Registrations",
    popularEvents: "Popular Events",
    recentRegs: "Recent Registrations",
    manageEvents: "Manage Events",
    addEvent: "Add New Event",
    attendance: "Attendance Status",
    markAttendance: "Mark Attendance",
    statusConfirmed: "Confirmed",
    statusCancelled: "Cancelled",
    attendancePending: "Pending",
    attendancePresent: "Present",
    attendanceAbsent: "Absent",
  },
  es: {
    // Navigation
    navHome: "Inicio",
    navEvents: "Eventos",
    navMyRegistrations: "Mis Registros",
    navAdminDashboard: "Panel Admin",
    navAbout: "Acerca de",
    navContact: "Contacto",
    navLogin: "Iniciar Sesión",
    navSignup: "Registrarse",
    navLogout: "Cerrar Sesión",
    
    // Auth & General
    email: "Correo Electrónico",
    password: "Contraseña",
    fullName: "Nombre Completo",
    confirmPassword: "Confirmar Contraseña",
    role: "Rol",
    student: "Estudiante",
    admin: "Administrador",
    welcome: "Bienvenido",
    
    // Event Fields
    title: "Título",
    description: "Descripción",
    category: "Categoría",
    date: "Fecha",
    time: "Hora",
    venue: "Lugar",
    organiser: "Organizador",
    seats: "Asientos",
    deadline: "Fecha Límite",
    tags: "Etiquetas",
    bannerUrl: "URL de la Imagen del Banner",
    
    // Actions
    btnRegister: "Registrarse Ahora",
    btnCancel: "Cancelar Registro",
    btnSubmit: "Enviar",
    btnSave: "Guardar Cambios",
    btnDelete: "Eliminar",
    btnEdit: "Editar",
    btnDownload: "Descargar Entrada",
    btnDownloadCert: "Descargar Certificado",
    btnBookmark: "Guardar",
    btnShare: "Compartir Evento",
    btnBack: "Atrás",
    
    // Page Content
    homeHeroTitle: "Enciende tu Vida Universitaria",
    homeHeroSubtitle: "Descubre y regístrate en los talleres, hackathons, torneos deportivos y festivales culturales más emocionantes a tu alrededor.",
    featuredEvents: "Eventos Destacados",
    allCategories: "Explorar Categorías",
    upcomingCount: "Próximos Eventos",
    totalSeats: "Asientos Totales",
    availableSeats: "Asientos Disponibles",
    seatsLeft: "asientos libres",
    eventStatus: "Estado del Evento",
    countdown: "El registro cierra en",
    
    // Registration Form
    regFormTitle: "Registro de Evento",
    rollNumber: "Matrícula/Carnet",
    phone: "Número Telefónico",
    department: "Departamento",
    selectDept: "Seleccionar Departamento",
    regSuccess: "¡Registro Exitoso!",
    regSuccessSub: "Se ha enviado un correo de confirmación que contiene su boleto con código QR.",
    
    // My Registrations Page
    myRegTitle: "Mis Registros",
    myRegSearchDesc: "Ingrese su correo electrónico para recuperar sus registros y entradas activas.",
    noRegs: "No se encontraron registros. ¡Regístrate en los eventos de la lista!",
    searchBtn: "Buscar",
    
    // Admin Dashboard
    adminStats: "Estadísticas Rápidas",
    totalRegistrations: "Registros Totales",
    popularEvents: "Eventos Populares",
    recentRegs: "Registros Recientes",
    manageEvents: "Administrar Eventos",
    addEvent: "Agregar Evento",
    attendance: "Asistencia",
    markAttendance: "Registrar Asistencia",
    statusConfirmed: "Confirmado",
    statusCancelled: "Cancelado",
    attendancePending: "Pendiente",
    attendancePresent: "Presente",
    attendanceAbsent: "Ausente",
  }
};

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem('locale') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  const toggleLanguage = () => {
    setLocale((prev) => (prev === 'en' ? 'es' : 'en'));
  };

  const t = (key) => {
    return translations[locale]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
