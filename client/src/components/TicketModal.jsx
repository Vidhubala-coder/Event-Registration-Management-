import React, { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, Printer, Download, Award, Clock, MapPin, User, Mail, ShieldAlert, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';

const TicketModal = ({ registration, onClose }) => {
  const { t } = useLanguage();
  const ticketRef = useRef(null);

  if (!registration) return null;
  const event = registration.eventId;

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    const printContent = ticketRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    
    // Create print-friendly window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket - ${event.title}</title>
          <style>
            body { font-family: 'Outfit', 'Inter', sans-serif; padding: 40px; color: #1e293b; text-align: center; }
            .ticket { border: 2px dashed #6366f1; border-radius: 16px; padding: 30px; max-width: 500px; margin: 0 auto; background-color: #fafafa; }
            .logo { font-size: 24px; font-weight: 800; color: #4f46e5; margin-bottom: 20px; }
            .title { font-size: 22px; font-weight: 800; color: #1e1b4b; margin: 10px 0; }
            .meta { font-size: 14px; color: #64748b; margin-bottom: 20px; }
            .details { text-align: left; background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e2e8f0; }
            .details p { margin: 8px 0; font-size: 14px; }
            .qr { margin: 20px 0; }
            .qr img { width: 180px; height: 180px; }
            .status { font-weight: bold; padding: 6px 12px; border-radius: 9999px; font-size: 12px; display: inline-block; }
            .confirmed { background-color: #d1fae5; color: #065f46; }
            .cancelled { background-color: #fee2e2; color: #991b1b; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="logo">EVENTPULSE TICKET</div>
            <div class="status ${registration.registrationStatus === 'Confirmed' ? 'confirmed' : 'cancelled'}">
              ${registration.registrationStatus.toUpperCase()}
            </div>
            <div class="title">${event.title}</div>
            <div class="meta">${formattedDate} • ${event.time}</div>
            <div class="meta">${event.venue}</div>
            <hr style="border: 0; border-top: 1px dashed #cbd5e1; margin: 20px 0;" />
            <div class="details">
              <p><strong>Attendee:</strong> ${registration.studentName}</p>
              <p><strong>Roll Number:</strong> ${registration.rollNumber}</p>
              <p><strong>Department:</strong> ${registration.department}</p>
              <p><strong>Email:</strong> ${registration.email}</p>
              <p><strong>Phone:</strong> ${registration.phone}</p>
            </div>
            <div class="qr">
              <img src="${registration.qrCode}" alt="QR Code" />
            </div>
            <p style="font-size: 12px; color: #94a3b8;">Please present this ticket at the entry gates.</p>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadCertificate = () => {
    // Dynamically print participation certificate
    const certWindow = window.open('', '_blank');
    certWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${registration.studentName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@400;600;800&display=swap');
            body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; height: 100vh; background-color: #f1f5f9; }
            .cert-container { 
              width: 800px; 
              height: 560px; 
              padding: 40px; 
              border: 12px double #b45309; 
              background-color: #fffbeb; 
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
              text-align: center;
              position: relative;
              font-family: 'Montserrat', sans-serif;
              box-sizing: border-box;
            }
            .cert-border {
              border: 2px solid #b45309;
              height: 100%;
              padding: 30px;
              box-sizing: border-box;
            }
            .cert-title { font-size: 38px; font-weight: 800; color: #1e1b4b; letter-spacing: 2px; margin-bottom: 10px; }
            .cert-subtitle { font-size: 14px; font-weight: 600; text-transform: uppercase; color: #b45309; letter-spacing: 4px; margin-bottom: 30px; }
            .cert-text { font-size: 16px; color: #475569; margin: 15px 0; }
            .student-name { font-family: 'Great Vibes', cursive; font-size: 48px; color: #b45309; margin: 20px 0; }
            .event-title { font-weight: 800; color: #1e1b4b; }
            .cert-date { font-size: 14px; color: #64748b; margin-top: 30px; }
            .cert-footer { display: flex; justify-content: space-between; margin-top: 40px; padding: 0 40px; }
            .signature { border-top: 1px solid #94a3b8; width: 180px; padding-top: 5px; font-size: 12px; color: #475569; font-weight: bold; }
            .seal { width: 70px; height: 70px; background-color: #b45309; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 2px dashed #fffbeb; }
          </style>
        </head>
        <body>
          <div class="cert-container">
            <div class="cert-border">
              <div class="cert-title">CERTIFICATE</div>
              <div class="cert-subtitle">OF PARTICIPATION</div>
              <div class="cert-text">This is proudly presented to</div>
              <div class="student-name">${registration.studentName}</div>
              <div class="cert-text">for actively participating and successfully completing the event</div>
              <div class="cert-text" style="font-size: 20px;"><span class="event-title">${event.title}</span></div>
              <div class="cert-text">organised by <strong>${event.organiser}</strong> on this date <strong>${new Date(event.date).toLocaleDateString()}</strong>.</div>
              
              <div class="cert-footer">
                <div class="signature">
                  Event Coordinator
                </div>
                <div class="seal">
                  OFFICIAL
                </div>
                <div class="signature">
                  Portal Administrator
                </div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    certWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg z-10 flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-violet-500" />
            <span>Ticket Pass</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Ticket Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center">
          {/* Printable Element Wrapper */}
          <div ref={ticketRef} className="w-full bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 flex flex-col items-center">
            {/* Statuses */}
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full ${
                registration.registrationStatus === 'Confirmed'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
              }`}>
                {registration.registrationStatus}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full ${
                registration.attendanceStatus === 'Present'
                  ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                  : registration.attendanceStatus === 'Absent'
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20'
              }`}>
                Attendance: {registration.attendanceStatus}
              </span>
            </div>

            {/* Event Name */}
            <h3 className="font-extrabold text-xl text-center text-indigo-950 dark:text-white mt-3 leading-snug">
              {event.title}
            </h3>

            {/* Schedule details */}
            <div className="flex flex-col gap-1 items-center mt-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{formattedDate} • {event.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{event.venue}</span>
              </div>
            </div>

            {/* Dash line divider */}
            <div className="w-full border-t border-dashed border-slate-300 dark:border-slate-800 my-4" />

            {/* Student Info Details */}
            <div className="w-full text-sm space-y-2 text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">Attendee Name</span>
                <span className="font-semibold text-slate-900 dark:text-white">{registration.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">Roll Number</span>
                <span className="font-semibold text-slate-900 dark:text-white">{registration.rollNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">Department</span>
                <span className="font-semibold text-slate-900 dark:text-white">{registration.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">Email</span>
                <span className="font-medium text-slate-900 dark:text-white truncate max-w-[180px]">{registration.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">Phone</span>
                <span className="font-medium text-slate-900 dark:text-white">{registration.phone}</span>
              </div>
            </div>

            {/* QR Code */}
            {registration.qrCode ? (
              <div className="mt-5 p-2.5 bg-white rounded-xl shadow-inner border border-slate-200/50">
                <img
                  src={registration.qrCode}
                  alt="QR Ticket Code"
                  className="w-40 h-40 object-contain"
                />
              </div>
            ) : (
              <div className="mt-5 text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>QR Code missing.</span>
              </div>
            )}
            
            <p className="mt-3 text-[10px] text-slate-400 text-center">
              Event Registration ID: {registration._id}
            </p>
          </div>
        </div>

        {/* Action Panel Footer */}
        <div className="p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 shrink-0">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Ticket</span>
          </button>

          {registration.attendanceStatus === 'Present' ? (
            <button
              onClick={handleDownloadCertificate}
              className="flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Award className="w-4.5 h-4.5" />
              <span>Get Certificate</span>
            </button>
          ) : (
            <button
              disabled
              className="flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-slate-200 dark:bg-slate-900 text-slate-400 dark:text-slate-600 text-sm font-bold border border-transparent cursor-not-allowed"
              title="Certificate unlocked once marked present by Admin"
            >
              <Award className="w-4.5 h-4.5" />
              <span>Cert. Locked</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TicketModal;
