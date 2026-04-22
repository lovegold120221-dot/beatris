import React, { useState, useEffect } from 'react';
import { UploadCloud, File, Trash2, CheckCircle2, Search, Loader2, ExternalLink } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { GoogleService } from '../services/googleService';

interface DocFile {
  id: string;
  filename?: string; // from firebase
  name?: string;     // from google drive
  status?: 'indexed' | 'processing' | 'failed';
  type?: string;
  mimeType?: string;
  webViewLink?: string;
  createdAt: any;
}

export default function DocsScreen() {
  const [docs, setDocs] = useState<DocFile[]>([]);
  const [googleDocs, setGoogleDocs] = useState<DocFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Load indexed files from Firestore
    const filesRef = collection(db, 'users', auth.currentUser.uid, 'files');
    const q = query(filesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DocFile[];
      setDocs(docsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching docs:", error);
      setLoading(false);
    });

    // Load recent files from Google Drive
    async function loadGoogleFiles() {
      try {
        const files = await GoogleService.listFiles(5);
        setGoogleDocs(files);
      } catch (err) {
        console.error("Failed to load Google Drive files", err);
      }
    }
    loadGoogleFiles();

    return () => unsubscribe();
  }, []);

  const handleUploadClick = async () => {
    if (!auth.currentUser) return;
    setUploading(true);
    try {
      const filesRef = collection(db, 'users', auth.currentUser.uid, 'files');
      await addDoc(filesRef, {
        userId: auth.currentUser.uid,
        filename: `Executive_Brief_${Math.floor(Math.random() * 1000)}.pdf`,
        status: 'indexed',
        type: 'PDF',
        mimeType: 'application/pdf',
        size: 1024 * 1024 * 2.5,
        storageUrl: 'https://example.com/mock-file.pdf',
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Upload simulation failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full px-4 pt-4 gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl tracking-tight text-white/90">Intelligence</h2>
        <span className="text-[10px] uppercase tracking-wider text-white/40">{docs.length + googleDocs.length} Docs Total</span>
      </div>

      <button 
        onClick={handleUploadClick}
        disabled={uploading}
        className="w-full glass-panel border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center cursor-pointer hover:bg-white/[0.08] transition-colors disabled:opacity-50"
      >
        <div className="w-12 h-12 rounded-full glass-panel-heavy flex items-center justify-center relative">
          {uploading ? <Loader2 size={20} className="text-[#D4AF37] animate-spin" /> : <UploadCloud size={20} className="text-[#D4AF37]" />}
        </div>
        <div>
          <p className="text-sm font-medium text-white/90">{uploading ? 'Processing...' : 'Upload Document'}</p>
          <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">PDF, DOCX, TXT max 50mb</p>
        </div>
      </button>

      <div className="flex flex-col gap-6 mt-2">
        {/* Google Drive Section */}
        {googleDocs.length > 0 && (
          <div className="flex flex-col gap-3">
             <h3 className="text-[10px] uppercase tracking-widest text-[#D4AF37] px-1 border-b border-[#D4AF37]/20 pb-2 flex items-center justify-between">
               <span>Recent Google Drive</span>
               <span className="opacity-60 text-[8px]">Live</span>
             </h3>
             {googleDocs.map(doc => (
               <div key={doc.id} className="glass-panel rounded-xl p-4 flex flex-col gap-3 group relative overflow-hidden border-[#D4AF37]/10">
                 <div className="flex items-start gap-3">
                   <div className="p-2 glass-panel-heavy rounded-lg text-white/70">
                     <File size={16} />
                   </div>
                   <div className="flex-1 overflow-hidden">
                     <p className="text-sm font-medium truncate text-white/80 group-hover:text-white transition-colors">{doc.name}</p>
                     <p className="text-[9px] uppercase tracking-wider text-white/30 truncate">{doc.mimeType?.split('.').pop()}</p>
                   </div>
                   {doc.webViewLink && (
                     <a href={doc.webViewLink} target="_blank" rel="noreferrer" className="p-2 text-white/30 hover:text-[#D4AF37] transition-colors">
                        <ExternalLink size={14} />
                     </a>
                   )}
                 </div>
               </div>
             ))}
          </div>
        )}

        {/* Indexed Knowledge Section */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[10px] uppercase tracking-widest text-white/40 px-1 border-b border-white/10 pb-2">Beatrice Internal Knowledge</h3>
          
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin text-[#D4AF37]" size={20} />
            </div>
          ) : docs.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-[10px] text-white/20 uppercase tracking-widest">No local documents</p>
            </div>
          ) : (
            docs.map(doc => (
              <div key={doc.id} className="glass-panel rounded-xl p-4 flex flex-col gap-3 group relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="p-2 glass-panel-heavy rounded-lg text-white/70">
                    <File size={16} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate text-white/80 group-hover:text-white transition-colors">{doc.filename}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle2 size={10} className="text-emerald-400" />
                      <span className="text-[9px] uppercase tracking-wider text-emerald-400/80">{doc.status}</span>
                      <span className="text-[9px] uppercase tracking-wider text-white/30">• {doc.type}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 glass-panel-heavy py-2 rounded-lg text-[10px] uppercase tracking-wider hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5 border border-white/5">
                    <Search size={12} className="text-[#D4AF37]" />
                    <span className="text-[#D4AF37]">Reference in Talk</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
