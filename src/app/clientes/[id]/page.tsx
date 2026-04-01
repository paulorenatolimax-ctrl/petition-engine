'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Upload, Copy, Check, Loader2, AlertTriangle, Clock } from 'lucide-react';

interface ClientDetail {
  id: string;
  name: string;
  email: string | null;
  visa_type: string;
  status: string;
  company_name: string | null;
  proposed_endeavor: string | null;
  soc_code: string | null;
  soc_title: string | null;
  location_city: string | null;
  location_state: string | null;
  docs_folder_path: string | null;
  notes: string | null;
  created_at: string;
  client_profiles?: {
    extracted_at: string | null;
    full_name: string | null;
    nationality: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    education: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    work_experience: any[];
    total_years_experience: number | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    publications: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    awards: any[];
    total_evidence_count: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    eb1a_criteria: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dhanasar_pillars: Record<string, any>;
  } | null;
  documents?: Array<{
    id: string;
    doc_type: string;
    version: number;
    status: string;
    quality_passed: boolean | null;
    generated_at: string;
  }>;
  activity_log?: Array<{
    id: string;
    action: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details: any;
    created_at: string;
  }>;
}

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [extractionPrompt, setExtractionPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [folderPath, setFolderPath] = useState('');
  const [showProfileJson, setShowProfileJson] = useState(false);
  const [profileJsonInput, setProfileJsonInput] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [, setEditingDocsPath] = useState(false);
  const [newDocsPath, setNewDocsPath] = useState('');

  useEffect(() => {
    fetchClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function fetchClient() {
    try {
      const res = await fetch(`/api/clients/${params.id}`);
      const json = await res.json();
      const data = json.data;
      setClient(data);
      setFolderPath(data?.docs_folder_path || '');
      setNewDocsPath(data?.docs_folder_path || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleExtract() {
    if (!folderPath) return;
    setExtracting(true);
    setExtractionPrompt('');

    try {
      // First save the folder path if changed
      if (folderPath !== client?.docs_folder_path) {
        await fetch(`/api/clients/${params.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ docs_folder_path: folderPath }),
        });
      }

      const res = await fetch(`/api/clients/${params.id}/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder_path: folderPath }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let prompt = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value);
          const events = text.split('\n\n').filter(Boolean);
          for (const event of events) {
            const dataLine = event.split('\n').find(l => l.startsWith('data:'));
            if (dataLine) {
              try {
                const data = JSON.parse(dataLine.replace('data: ', ''));
                if (data.prompt) prompt = data.prompt;
              } catch {}
            }
          }
        }
      }

      if (prompt) setExtractionPrompt(prompt);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert('Erro na extração: ' + err.message);
    } finally {
      setExtracting(false);
    }
  }

  async function saveProfile() {
    setSavingProfile(true);
    try {
      const profileData = JSON.parse(profileJsonInput);
      await fetch(`/api/clients/${params.id}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      setShowProfileJson(false);
      setProfileJsonInput('');
      fetchClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert('JSON inválido: ' + err.message);
    } finally {
      setSavingProfile(false);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function updateDocsPath() {
    await fetch(`/api/clients/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docs_folder_path: newDocsPath }),
    });
    setEditingDocsPath(false);
    setFolderPath(newDocsPath);
    fetchClient();
  }

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#666' }}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} /></div>;
  if (!client) return <div style={{ padding: '60px', textAlign: 'center', color: '#666' }}>Cliente não encontrado</div>;

  const profile = client.client_profiles;
  const hasProfile = profile?.extracted_at;

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Back + Header */}
      <button onClick={() => router.push('/clientes')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', fontSize: '13px', padding: 0 }}>
        <ArrowLeft size={16} /> Voltar para Clientes
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(45,212,191,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#2dd4bf', fontWeight: 700 }}>
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f5f5f5', margin: 0 }}>{client.name}</h1>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '6px' }}>
              <span style={{ background: 'rgba(45,212,191,0.1)', color: '#2dd4bf', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>{client.visa_type}</span>
              {client.company_name && <span style={{ color: '#666', fontSize: '13px' }}>{client.company_name}</span>}
              {client.location_city && <span style={{ color: '#555', fontSize: '12px' }}>{client.location_city}, {client.location_state}</span>}
            </div>
          </div>
        </div>
        <button
          onClick={() => router.push(`/gerador?client=${client.id}`)}
          style={{ background: 'linear-gradient(135deg, #2dd4bf 0%, #06b6d4 100%)', color: '#0a0a0a', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}
        >
          Gerar Documento
        </button>
      </div>

      {/* Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Dados do Cliente</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {client.email && <div style={{ color: '#ccc', fontSize: '13px' }}>Email: {client.email}</div>}
            {client.proposed_endeavor && <div style={{ color: '#ccc', fontSize: '13px' }}>Endeavor: {client.proposed_endeavor}</div>}
            {client.soc_code && <div style={{ color: '#ccc', fontSize: '13px' }}>SOC: {client.soc_code} — {client.soc_title}</div>}
            <div style={{ color: '#555', fontSize: '12px', marginTop: '4px' }}>Criado em: {new Date(client.created_at).toLocaleDateString('pt-BR')}</div>
          </div>
        </div>

        <div style={{ background: '#111', border: `1px solid ${hasProfile ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)'}`, borderRadius: '12px', padding: '20px' }}>
          <div style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Perfil Extraído</div>
          {hasProfile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ color: '#22c55e', fontSize: '13px', fontWeight: 500 }}>Perfil disponível</div>
              <div style={{ color: '#ccc', fontSize: '12px' }}>Evidências: {profile?.total_evidence_count || 0}</div>
              <div style={{ color: '#ccc', fontSize: '12px' }}>Educação: {profile?.education?.length || 0} registros</div>
              <div style={{ color: '#ccc', fontSize: '12px' }}>Publicações: {profile?.publications?.length || 0}</div>
              <div style={{ color: '#555', fontSize: '11px' }}>Extraído: {new Date(profile!.extracted_at!).toLocaleDateString('pt-BR')}</div>
            </div>
          ) : (
            <div style={{ color: '#eab308', fontSize: '13px' }}>
              <AlertTriangle size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Perfil ainda não extraído
            </div>
          )}
        </div>
      </div>

      {/* Extraction Section */}
      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ color: '#f5f5f5', margin: '0 0 16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Upload size={18} color="#2dd4bf" />
          Extração de Documentos
        </h3>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Caminho da pasta de documentos do cliente"
            value={folderPath}
            onChange={(e) => setFolderPath(e.target.value)}
            style={{ flex: 1, background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 14px', color: '#f5f5f5', fontSize: '13px', outline: 'none' }}
          />
          <button
            onClick={handleExtract}
            disabled={!folderPath || extracting}
            style={{
              background: folderPath && !extracting ? 'linear-gradient(135deg, #2dd4bf 0%, #06b6d4 100%)' : '#222',
              color: folderPath && !extracting ? '#0a0a0a' : '#555',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: folderPath && !extracting ? 'pointer' : 'not-allowed',
              fontSize: '13px',
              whiteSpace: 'nowrap',
            }}
          >
            {extracting ? 'Extraindo...' : 'Extrair Perfil'}
          </button>
        </div>

        {/* Extraction Prompt Result */}
        {extractionPrompt && (
          <div>
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>
              Prompt de extração gerado. Copie e cole no Claude Code. Depois cole o JSON resultante abaixo.
            </div>
            <textarea
              readOnly
              value={extractionPrompt}
              style={{ width: '100%', height: '200px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px', color: '#d4d4d4', fontSize: '11px', fontFamily: 'monospace', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(extractionPrompt);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                style={{ background: 'rgba(45,212,191,0.1)', color: '#2dd4bf', border: '1px solid rgba(45,212,191,0.2)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {copied ? <><Check size={14} /> Copiado</> : <><Copy size={14} /> Copiar Prompt</>}
              </button>
              <button
                onClick={() => setShowProfileJson(true)}
                style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
              >
                Colar JSON do Perfil
              </button>
            </div>
          </div>
        )}

        {/* Profile JSON Input */}
        {showProfileJson && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>
              Cole o JSON retornado pelo Claude Code:
            </div>
            <textarea
              value={profileJsonInput}
              onChange={(e) => setProfileJsonInput(e.target.value)}
              placeholder='{"full_name": "...", "nationality": "...", ...}'
              style={{ width: '100%', height: '200px', background: '#0a0a0a', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '8px', padding: '12px', color: '#d4d4d4', fontSize: '11px', fontFamily: 'monospace', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowProfileJson(false)} style={{ background: 'transparent', color: '#888', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Cancelar</button>
              <button onClick={saveProfile} disabled={!profileJsonInput || savingProfile} style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                {savingProfile ? 'Salvando...' : 'Salvar Perfil'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Documents History */}
      {client.documents && client.documents.length > 0 && (
        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ color: '#f5f5f5', margin: '0 0 16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="#2dd4bf" />
            Documentos Gerados ({client.documents.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {client.documents.map(doc => (
              <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#0a0a0a', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={16} color="#666" />
                  <span style={{ color: '#f5f5f5', fontSize: '13px' }}>{doc.doc_type}</span>
                  <span style={{ color: '#555', fontSize: '11px' }}>v{doc.version}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: doc.quality_passed === true ? '#22c55e' : doc.quality_passed === false ? '#ef4444' : '#555',
                  }} />
                  <span style={{ color: '#555', fontSize: '11px' }}>{new Date(doc.generated_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Log */}
      {client.activity_log && client.activity_log.length > 0 && (
        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ color: '#f5f5f5', margin: '0 0 16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="#2dd4bf" />
            Atividade Recente
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {client.activity_log.slice(0, 10).map(log => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <span style={{ color: '#ccc', fontSize: '12px' }}>{log.action.replace(/_/g, ' ')}</span>
                <span style={{ color: '#555', fontSize: '11px' }}>{new Date(log.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
