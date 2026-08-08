// Service untuk mengelola feedback dari pengguna

export interface Feedback {
  id: string;
  name: string;
  email?: string;
  role: string;
  category: 'bug' | 'saran' | 'keluhan' | 'pertanyaan' | 'lainnya';
  subject: string;
  message: string;
  priority: 'rendah' | 'sedang' | 'tinggi';
  status: 'pending' | 'dibaca' | 'diproses' | 'selesai';
  submittedAt: number;
  adminNotes?: string;
  processedAt?: number;
}

const STORAGE_KEY = 'feedback_data';

// Mendapatkan semua feedback
export function getFeedbacks(): Feedback[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading feedback data:', error);
    return [];
  }
}

// Menyimpan semua feedback
export function saveFeedbacks(feedbacks: Feedback[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
  } catch (error) {
    console.error('Error saving feedback data:', error);
  }
}

// Menambah feedback baru
export function addFeedback(feedback: Omit<Feedback, 'id' | 'submittedAt' | 'status'>): Feedback {
  const feedbacks = getFeedbacks();
  const newFeedback: Feedback = {
    ...feedback,
    id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    submittedAt: Date.now(),
    status: 'pending',
  };
  
  feedbacks.unshift(newFeedback); // Add to beginning
  saveFeedbacks(feedbacks);
  
  return newFeedback;
}

// Update status feedback
export function updateFeedbackStatus(id: string, status: Feedback['status'], adminNotes?: string): void {
  const feedbacks = getFeedbacks();
  const index = feedbacks.findIndex(f => f.id === id);
  
  if (index !== -1) {
    feedbacks[index] = {
      ...feedbacks[index],
      status,
      adminNotes,
      processedAt: status !== 'pending' ? Date.now() : undefined,
    };
    saveFeedbacks(feedbacks);
  }
}

// Mendapatkan feedback berdasarkan status
export function getFeedbacksByStatus(status: Feedback['status']): Feedback[] {
  return getFeedbacks().filter(f => f.status === status);
}

// Mendapatkan feedback berdasarkan kategori
export function getFeedbacksByCategory(category: Feedback['category']): Feedback[] {
  return getFeedbacks().filter(f => f.category === category);
}

// Mendapatkan feedback berdasarkan prioritas
export function getFeedbacksByPriority(priority: Feedback['priority']): Feedback[] {
  return getFeedbacks().filter(f => f.priority === priority);
}

// Menghapus feedback
export function deleteFeedback(id: string): void {
  const feedbacks = getFeedbacks().filter(f => f.id !== id);
  saveFeedbacks(feedbacks);
}

// Kirim feedback ke email (menggunakan EmailJS)
export async function sendFeedbackToEmail(feedback: Feedback, recipientEmail: string): Promise<{ success: boolean; message: string }> {
  try {
    // Import EmailJS secara dinamis untuk menghindari import error saat development
    const emailjs = (await import('@emailjs/browser')).default;
    
    const templateParams = {
      from_name: feedback.name,
      from_email: feedback.email || 'Tidak ada email',
      role: feedback.role,
      category: feedback.category,
      subject: feedback.subject,
      message: feedback.message,
      priority: feedback.priority,
      to_email: recipientEmail,
      submitted_at: new Date(feedback.submittedAt).toLocaleString('id-ID'),
    };
    
    // Gunakan EmailJS service ID, template ID, dan public key
    // Untuk development, kita akan menggunakan mode simulasi jika kredensial belum diset
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service';
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'default_template';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'default_public_key';
    
    // Cek apakah kredensial EmailJS sudah diset
    if (serviceId === 'default_service' || templateId === 'default_template' || publicKey === 'default_public_key') {
      console.log('EmailJS credentials belum diset, menggunakan mode simulasi');
      console.log('Feedback data yang akan dikirim:', templateParams);
      
      // Mode simulasi - return success tapi log data
      return {
        success: true,
        message: 'Feedback berhasil disimpan (mode simulasi - email tidak dikirim)'
      };
    }
    
    // Kirim email menggunakan EmailJS yang sebenarnya
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );
    
    return {
      success: response.status === 200,
      message: response.status === 200 ? 'Feedback berhasil dikirim ke email admin' : 'Gagal mengirim email'
    };
    
  } catch (error) {
    console.error('Error sending feedback email:', error);
    return {
      success: false,
      message: 'Gagal mengirim feedback ke email'
    };
  }
}

// Mendapatkan statistik feedback
export function getFeedbackStats() {
  const feedbacks = getFeedbacks();
  
  return {
    total: feedbacks.length,
    pending: feedbacks.filter(f => f.status === 'pending').length,
    dibaca: feedbacks.filter(f => f.status === 'dibaca').length,
    diproses: feedbacks.filter(f => f.status === 'diproses').length,
    selesai: feedbacks.filter(f => f.status === 'selesai').length,
    byCategory: {
      bug: feedbacks.filter(f => f.category === 'bug').length,
      saran: feedbacks.filter(f => f.category === 'saran').length,
      keluhan: feedbacks.filter(f => f.category === 'keluhan').length,
      pertanyaan: feedbacks.filter(f => f.category === 'pertanyaan').length,
      lainnya: feedbacks.filter(f => f.category === 'lainnya').length,
    },
    byPriority: {
      rendah: feedbacks.filter(f => f.priority === 'rendah').length,
      sedang: feedbacks.filter(f => f.priority === 'sedang').length,
      tinggi: feedbacks.filter(f => f.priority === 'tinggi').length,
    },
  };
}